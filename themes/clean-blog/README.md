
# Clean Blog (Default Theme)

Olopage starter theme.

```
themes/
└── clean-blog/
    └── assets/
        ├── css
        ├── img
        ├── js
        └── favicon.ico
    └── models/
        ├── posts.js
        └── users.js
    └── views/
        └── layouts/
            ├── partials/
                ├── header.ejs
                └── footer.ejs
            └── default.ejs
        ├── 404.ejs
        ├── about.ejs
        ├── contact.ejs
        ├── index.ejs
        └── post.ejs
    ├── cache.js
    ├── config.js
    ├── db.js
    ├── README.md
    ├── redis.js
    └── server.js
```

## Theme Configuration

config.json

```
{
  "name": "clean-blog",
  "version": "1.0",
  "pages": [
    { "path": "about", "defaultContent": "" },
    { "path": "contact", "defaultContent": "" },
    { "path": "index" },
    { "path": "post", "defaultContent": "" }
  ]
}
```

## Changing Theme

You can change the default theme from jsconfig.json in the project root.

jsconfig.json

```
{
  "theme": "clean-blog",
}
```
