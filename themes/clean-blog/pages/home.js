import knex from '../knex.js';
import { cacheQueryResults } from '../cache.js';

export default function home(app, config) {
  app.get("/", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const offset = (page - 1) * limit;

    try {
      const posts = await cacheQueryResults(`posts:page-${page}`, async () => {
        return await knex('posts')
          .select(['posts.title', 'posts.permalink','posts.description','posts.publishedAt','userProfile.userId','userProfile.firstname','files.fileName'])
          .leftJoin('userProfile', 'posts.authorId', 'userProfile.userId')
          .leftJoin('files', function() {
            this.on('posts.featuredImageId', '=', 'files.fileId')
              .andOn('files.fileTag', '=', knex.raw('?', ['thumb']))
              .andOn('files.fileDimension', '=', knex.raw('?', ['160x110']));
          })
          .orderBy('posts.createdAt', 'desc')
          .limit(limit)
          .offset(offset);
      });

      const totalPosts = await cacheQueryResults(`posts:total`, async () => {
        return await knex('posts').count({ count: '*' }).first();
      });

      res.render('index', {
        title: 'Welcome Clean Blog Theme !',
        keywords: '',
        scripts: '',
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
}
