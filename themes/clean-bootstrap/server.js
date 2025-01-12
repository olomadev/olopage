
import express from "express";
import ViteExpress from "vite-express";
import config from '../../jsconfig.json' assert { type: 'json' };
import { sequelize } from './db.js'; // Import sequelize instance
import { Posts } from './models/post.js';  // Import Post model
import { Users } from './models/users.js';  // Import User model
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the reverse relationship
Posts.belongsTo(Users, { foreignKey: 'authorId' });
Users.hasMany(Posts, { foreignKey: 'authorId' });

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // set the global views directory
app.use(express.static('public')); // use static files
app.use("/themes", express.static(path.join(__dirname, `themes/${config.theme}/assets`)));

const themeConfigPath = `./themes/${config.theme}/config.json`;
const themeConfig = JSON.parse(fs.readFileSync(themeConfigPath, "utf8"));

// Ensure associations are set after models are loaded
// Posts.associate({ Users });
// Users.associate({ Posts });

app.get("/", async (req, res) => {
  //
  // Get all posts along with user information (JOIN with users table)
  // 
  const posts = await Posts.findAll({
    include: [{
      model: Users,
      required: true, // This enforces an INNER JOIN (equivalent to SQL INNER JOIN)
      attributes: ['userId', 'email', 'firstname', 'lastname'], // Select specific user fields
    }],
  });

  // console.log(posts)

  res.render('index', {
    themePath: `themes/${config.theme}`,
  });
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
