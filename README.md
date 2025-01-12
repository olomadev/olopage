
# Olopage

Amazing fast, simple and flexible blog application for Node.js developers.

## Philosophy 🐧

This application is an anti-page builder application and semi-automatic page content manager. Please hire a software developer to create better quality web pages. You don't need page builders, you need to hire developers. And we created this software for developers.

<p align="center">
  <img src="goat.png" border="0" />
</p>

## Tech Stack 💚

<table>
	<tbody>
		<tr>
			<td><b>Frontend</b></td>
			<td>Node/Express.js (For speed, cache, flexibility and easy switching of themes). 💪</td>
		</tr>
		<tr>
			<td><b>Frontend-Dev</b></td>
			<td>Vue.js (To simplify and speed up the development environment). 🍏</td>
		</tr>
		<tr>
			<td><b>Backend</b></td>
			<td>Php/Mezzio (In the background, we used PHP, the leading language in open source CMS projects). 👑 🐧</td>
		</tr>
		<tr>
			<td><b>Database</b></td>
			<td>MySQL & Redis (We used MySQL for RMDBS and Redis for caching operations). 🍺</td>
		</tr>
	</tbody>
</table>

## Themes 👚

Starter theme.

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

### Theme Configuration

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

### Changing Theme

You can change the default theme from jsconfig.json in the project root.

jsconfig.json

```
{
  "theme": "clean-blog",
}
```