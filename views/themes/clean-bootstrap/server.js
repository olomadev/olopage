
import express from "express";
import ViteExpress from "vite-express";
import config from "@/views/config.json" assert { type: "json" };

import { Post } from './models/Post';  // Import Post model
import { User } from './models/User';  // Import User model

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use("/themes", express.static(path.join(__dirname, `themes/${config.theme}/assets`)));

const themeConfigPath = `./themes/${config.theme}/config.json`;
const themeConfig = JSON.parse(fs.readFileSync(themeConfigPath, "utf8"));

app.get("/", (req, res) => {
  //
  // Get all posts along with user information (JOIN with users table)
  // 
  const posts = await Post.findAll({
    include: [{
      model: User,
      required: true, // This enforces an INNER JOIN (equivalent to SQL INNER JOIN)
      attributes: ['userId', 'email', 'firstname', 'lastname'], // Select specific user fields
    }],
  });

  console.log(posts)

  res.render(`themes/${config.theme}/${route}`, {
    themePath: `themes/${config.theme}`,
    page: route,
  });
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
