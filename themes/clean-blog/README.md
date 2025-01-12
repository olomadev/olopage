
## Clean Bootstrap (Default Theme)


```
themes/
└── clean-bootstrap/
    └── views/
        ├── index.ejs
        ├── post.ejs
        └── contact.ejs
```


```
import express from "express";
import { sequelize } from "./db"; // veritabanı bağlantısı
import { Post } from "./models/post";
import { User } from "./models/user";
import { Comment } from "./models/comment";

const app = express();
app.use(express.json());

// Veritabanı senkronizasyonu
await sequelize.sync();

// Rotalar
app.get("/posts", async (req, res) => {
  const posts = await Post.findAll();
  res.json(posts);
});

app.post("/posts", async (req, res) => {
  const post = await Post.create(req.body);
  res.json(post);
});

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.get("/comments", async (req, res) => {
  const comments = await Comment.findAll();
  res.json(comments);
});

app.post("/comments", async (req, res) => {
  const comment = await Comment.create(req.body);
  res.json(comment);
});


ViteExpress.listen(app, 3000, () =>
  console.log("Clean-Bootstrap Server is listening on port 3000..."),
);
```