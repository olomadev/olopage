import express from "express";
import expressLayouts from 'express-ejs-layouts';
import ViteExpress from "vite-express";

import config from '../../config.json' assert { type: 'json' };

import { sequelize } from './db.js'; // Import sequelize instance
import { Posts } from './models/post.js';  // Import Post model
import { Users } from './models/users.js';  // Import User model
import { cacheQueryResults } from './cache.js'; // Import the cache helper
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const themeConfigPath = `./themes/${config.theme}/config.json`;
const themeConfig = JSON.parse(fs.readFileSync(themeConfigPath, "utf8"));

// Define the reverse relationship
Posts.belongsTo(Users, { foreignKey: 'authorId' });
Users.hasMany(Posts, { foreignKey: 'authorId' });

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // set the global views directory
app.use(expressLayouts);
app.use("/themes", express.static(path.join(__dirname, `/themes/${config.theme}/assets`)));
app.use(express.static(path.join(__dirname, 'public')));
//
// set default layout
//
app.set('layout', 'layouts/default');

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
    themePath: `themes/${config.theme}`,
    posts: posts,  // Pass the fetched or cached posts to the view
  });
});

app.get("/about", async (req, res) => {
  res.render('about', { themePath: `themes/${config.theme}`});
});
app.get("/contact", async (req, res) => {
  res.render('contact', { themePath: `themes/${config.theme}`});
});
app.get("/:slug", async (req, res) => {
  const slug = req.params.slug;
  const post = await Posts.findOne({ where: { slug: slug } });
  if (!post) {
    return res.status(404).render("404");
  }
  res.render('post', {
    themePath: `themes/${config.theme}`,
    post,
  });
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
