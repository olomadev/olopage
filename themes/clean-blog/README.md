
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
    ├── config.json
    ├── knex.js
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
  "author": "Oloma",
  "keywords": "default, clean-blog, clean, simple, blog, cms",
  "description": ""
}
```

## Changing Theme

You can change the default theme from jsconfig.json in the project root.

jsconfig.json

```
{
  "port": 3000,
  "theme": "clean-blog",
  "path": "themes/clean-blog"
}
```
