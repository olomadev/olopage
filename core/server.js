/**
 * Olopage core/server.js - v1.0 - 2025
 * 
 * Core server.js - do not touch this file it can be
 * change when update your application
 */
import dotenv from 'dotenv';
import express from "express";
import expressLayouts from 'express-ejs-layouts';
import ViteExpress from "vite-express";
import config from '../config.json' assert { type: 'json' };
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// const themeConfigPath = `./themes/${config.theme}/config.json`;
// const themeConfig = JSON.parse(fs.readFileSync(themeConfigPath, "utf8"));

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, `../themes/${config.theme}/views`));
app.use(expressLayouts);
app.use("/themes", express.static(path.join(__dirname, `/themes/${config.theme}/assets`)));
app.use(express.static(path.join(__dirname, "../public")));

const themePath = `../themes/${config.theme}/server.js`;
import(themePath)
  .then(({ default: themeServer }) => themeServer(app, config))
  .catch((err) => console.error("Theme could not be loaded:", err));

ViteExpress.listen(app, config.port, () =>
  console.log("Server is listening on port " + config.port + "..."),
);