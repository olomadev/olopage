import knex from './knex.js'; // db
import { cacheQueryResults } from './cache.js';

export default function themeServer(app, config) {
  app.set('layout', 'layouts/default'); // set default layout
  app.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const offset = (page - 1) * limit;

    try {
      const posts = await cacheQueryResults(`olopage:posts-page-${page}`, async () => {
        return await knex('posts')
          .select(['posts.title', 'posts.permalink','posts.description','posts.publishedAt','users.userId','users.firstname','files.fileName'])
          .leftJoin('users', 'posts.authorId', 'users.userId')
          .leftJoin('files', function() {
            this.on('posts.featuredImageId', '=', 'files.fileId')
              .andOn('files.fileTag', '=', knex.raw('?', ['thumb']))
              .andOn('files.fileDimension', '=', knex.raw('?', ['160x110']));
          })
          .orderBy('posts.createdAt', 'desc')
          .limit(limit)
          .offset(offset);
      });
      const totalPosts = await knex('posts').count({ count: '*' }).first();

      res.render('index', {
        title: 'Welcome Clean Blog Theme !',
        keywords: '',
        description: '',
        themePath: config.path,
        posts: posts,
        currentPage: page,
        apiUrl: process.env.API_URL,
        totalPages: Math.ceil(totalPosts.count / limit)
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching the posts.');
    }
  });

  app.get("/:slug", async (req, res) => {
    const slug = req.params.slug;
    try {
      const post = await knex('posts')
        .select('title', 'authorId', 'description', 'contentHtml', 'createdAt')
        .where({ permalink: slug })
        .first();

      if (!post) {
        return res.status(404).render("404");
      }
      res.render('post', {
        post,
        title: post.title || '',
        keywords: post.keywords || '',
        description: post.description || '',
        themePath: config.path,
        pageCss: 'article.css',
        apiUrl: process.env.API_URL,
        contentHtml: post.contentHtml
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching the post.');
    }
  });

  app.get("/about", async (req, res) => {
    res.render('about', { themePath: config.path });
  });

  app.get("/contact", async (req, res) => {
    res.render('contact', { themePath: config.path });
  });
}
