/**
 * Clean-blog default theme v1.0 - 2025
 */
import expressLayouts from "express-ejs-layouts";
import { Posts } from "./models/posts.js";
import { Users } from "./models/users.js";
import { cacheQueryResults } from './cache.js'; // Import the cache helper

Posts.belongsTo(Users, { foreignKey: 'authorId' });
Users.hasMany(Posts, { foreignKey: 'authorId' });

export default function themeServer(app, config) {
  //
  // set default layout
  //
  app.set('layout', 'layouts/default');

  // app.use(expressLayouts);
  // app.use("/themes", express.static("assets"));

  app.get("/", async (req, res) => {
    const posts = await cacheQueryResults("olopage:posts-all", async () => {
      return await Posts.findAll({
        include: [{
          model: Users,
          required: true,  // This will perform an INNER JOIN to fetch associated users
          attributes: ['userId', 'email', 'firstname', 'lastname'],  // Fetch specific user fields
        }],
      });
    });
    // Render the data to the view
    res.render('index', {
      title: 'Welcome !',
      keywords: '',
      description: '',
      themePath: config.path,
      posts: posts,  // Pass the fetched or cached posts to the view
    });
  });

  app.get("/about", async (req, res) => {
    res.render('about', { themePath: config.path });
  });

  app.get("/contact", async (req, res) => {
    res.render('contact', { themePath: config.path });
  });

  app.get("/:slug", async (req, res) => {
    const slug = req.params.slug;
    const post = await Posts.findOne({ where: { slug: slug } });
    if (!post) {
      return res.status(404).render("404");
    }
    res.render('post', {
      themePath: config.path,
      post,
    });
  });

}