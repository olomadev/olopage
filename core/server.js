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
import cors from 'cors';
import config from '../config.json' assert { type: 'json' };
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
import { Builder } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import sharp from 'sharp'; 

// const themeConfigPath = `./themes/${config.theme}/config.json`;
// const themeConfig = JSON.parse(fs.readFileSync(themeConfigPath, "utf8"));

const app = express();
app.use(cors());  // this will allow all incoming requests
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, `../themes/${config.theme}/views`));
app.use(expressLayouts);
app.use("/themes", express.static(path.join(__dirname, `/themes/${config.theme}/assets`)));
app.use(express.static(path.join(__dirname, "../public")));

const themePath = `../themes/${config.theme}/server.js`;
import(themePath)
  .then(({ default: themeServer }) => themeServer(app, config))
  .catch((err) => console.error("Theme could not be loaded:", err));
//
// Screenshot API Endpoint v1.0
// 
// example: http://localhost:3000/screenshot?url=https://example.com&apiKey=VITE_SCREENSHOT_API_KEY
// 
app.get('/screenshot', async (req, res) => {
  let { url, apiKey } = req.query;

  // check API KEY
  if (!config.screenshotApiKey) {
    return res.status(400).json({ error: 'Enter a "screenshotApiKey" to your config.json.' });
  }
  if (!apiKey || config.screenshotApiKey != apiKey) {
    return res.status(400).json({ error: 'Screenshot api key is incorrect.' });
  }
  // check URL
  if (!url) {
    return res.status(400).json({ error: 'Please enter a URL.' });
  }
  try {
    // set browser options
    const options = new Options();
    options.addArguments(
      '--headless', 
      '--disable-gpu', 
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--remote-debugging-port=9222',
      '--user-data-dir=/tmp/chrome_user_data' // specify a unique folder
    );
    // start browser
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
    // open page
    await driver.get(url);

    // get the dimensions and position of the <main> element
    const mainElement = await driver.findElement({ tagName: 'main' });
    const rect = await mainElement.getRect();

    const largeWidth = 1960;
    const largeHeight = 2700;
    await driver.manage().window().setRect({ width: largeWidth, height: largeHeight });

    // zoom out
    await driver.executeScript('document.body.style.zoom = "0.7";'); // %70 zoom out

    // take screenshot
    const screenshot = await driver.takeScreenshot();

    // crop the screenshot based on <main> element's coordinates
    const croppedImage = await sharp(Buffer.from(screenshot, 'base64'))
      .extract({
        left: rect.x, // position of the <main> element on the x-axis
        top: 100, // position of the <main> element on the y-axis
        width: rect.width, // width of the <main> element
        height: rect.height // height of the <main> element
      })
      .extend({
          top: 180,    // add 150px top padding
          bottom: 50, // add 50px bottom
          background: { r: 255, g: 255, b: 255 } // Padding alanını beyaz yap
        })
      .toBuffer();

    // resize image
    const resizedImage = await sharp(Buffer.from(croppedImage, 'base64'))
      .resize(196, 270) // thumbnail dimensions
      .toBuffer();

    const base64thumb = resizedImage.toString('base64')
    //
    // 
    // burada base64thumb çıktısı base64 olarak veritabanına kayıt edilecek ...
    // 

    // send to browser
    res.setHeader('Content-Type', 'image/webp');
    res.send(Buffer.from(resizedImage, 'base64'));

    await driver.quit();

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while taking a screenshot.' });
  }
});

ViteExpress.listen(app, config.port, () =>
  console.log("Server is listening on port " + config.port + "..."),
);