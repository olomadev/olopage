
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
        ├── about.ejs
        ├── contact.ejs
        ├── index.ejs
        └── post.ejs
    ├── config.json
    ├── db.js
    ├── README.md
    └── server.js
```

## Theme Configuration

```
{
  "name": "clean-blog",
  "version": "1.0",
  "pages": [
    { "path": "about", "content": "" },
    { "path": "contact", "content": "" },
    { "path": "index" },
    { "path": "post", "content": "" }
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
