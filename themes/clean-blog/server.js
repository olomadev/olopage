import knex from './knex.js'; // db
import { cacheQueryResults } from './cache.js';
import home from './pages/home.js';
import post from './pages/post.js';
import about from './pages/about.js';
import contact from './pages/contact.js';

export default function themeServer(app, config) {
  app.set('layout', 'layouts/default'); // default layout

  // routes
  home(app, config);
  post(app, config);
  about(app, config);
  contact(app, config);
}