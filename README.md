
# Olopage

🚀 Amazing fast and flexible blog application for Node.js developers.

## Philosophy 🐧

A no-page builder blog application and simple content manager developed for developers.

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
    ├── pages/
    │   ├── home.js
    │   ├── post.js
    │   ├── about.js
    │   ├── contact.js
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


themes/
└── clean-blog/

    ├── assets/
    ├── views/
    ├── cache.js
    ├── config.json
    ├── knex.js
    ├── redis.js
    ├── server.js


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
