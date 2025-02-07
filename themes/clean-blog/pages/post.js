import knex from '../knex.js';
import { cacheQueryResults } from '../cache.js';
import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import ipware from "ipware"; // Default import
const { get_ip } = ipware();
import redis from '../redis.js'; // Import the Redis client

export default function post(app, config) {
  //
  // post detail page
  // 
  app.get("/:slug", async (req, res) => {
    const slug = req.params.slug;
    try {
      const post = await cacheQueryResults(`posts:${slug}`, async () => {
        return await knex('posts')
          .select(
            'title',
            'postId',
            'authorId',
            'description',
            'contentHtml',
            'createdAt',
            'userProfile.jobTitle',
            'userProfile.firstname',
            'userProfile.lastname'
            )
          .leftJoin('userProfile', 'posts.authorId', 'userProfile.userId')
          .where({ permalink: slug })
          .first();
      });
      if (!post) {
        return res.status(404).render("404");
      }
      const claps = await cacheQueryResults(`claps:${post.postId}`, async () => {
        const result = await knex('postClaps')
          .where({ postId: post.postId })
          .count('* as totalClaps')
          .first();
        return result?.totalClaps || 0
      });

      const comments = await cacheQueryResults(`comments:${slug}`, async () => {
        return await knex('postComments')
          .select('name', 'email', 'body', 'createdAt')
          .where({ postId: post?.postId, published: 1 });
      });

      res.render('post', {
        post,
        comments,
        claps,
        hcaptchaSiteKey: process.env.HCAPTCHA_SITE_KEY,
        title: post.title || '',
        keywords: post.keywords || '',
        description: post.description || '',
        themePath: config.path,
        pageCss: 'article.css',
        apiUrl: process.env.API_URL,
        contentHtml: post.contentHtml
      });

    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching the post.');
    }
  });
  //
  // clap action
  // 
  app.post("/clap/:postId", async (req, res) => {
    const { postId } = req.params;
    const { clientIp } = get_ip(req);

    // if the IP starts with "::ffff:", clear it
    let ip = clientIp;
    if (ip.startsWith("::ffff:")) {
      ip = ip.replace("::ffff:", "");
    }
    const userAgent = req.headers["user-agent"];

    if (!postId || !uuidValidate(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post ID format." });
    }
    // check post is exists ?
    const post = await knex('posts').select('postId').where({ postId }).first();
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }
    try {
      const existingClap = await knex("postClaps")
        .where({ postId, ip, userAgent })
        .first();

      if (existingClap) {
        return res.status(400).json({ success: false, message: "You applauded before !" });
      }
      await knex("postClaps").insert({
        clapId: uuidv4(),
        postId,
        ip,
        userAgent,
        createdAt: new Date(),
      });

      // delete cache ..
      redis.del(process.env.CACHE_ROOT_KEY + "claps:" + postId); 

      return res.json({ success: true, message: "Thanks. You applauded !" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "An error has occurred." });
    }
  });
  //
  // leave a comment action
  // 
  app.post("/comment/:postId", async (req, res) => {
    const { postId } = req.params;
    const { name, body, captcha } = req.body;

    if (!postId || !uuidValidate(postId)) {
      return res.status(400).json({ success: false, message: "Invalid post ID format." });
    }
    if (!name || !body) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    // check post is exists ?
    const post = await knex('posts').select('postId').where({ postId }).first();
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }
    try {
      const secretKey = process.env.HCAPTCHA_SECRET_KEY;
      const captchaVerifyURL = "https://api.hcaptcha.com/siteverify";
      const captchaResponse = await fetch(captchaVerifyURL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: captcha,
        }),
      });
      const captchaData = await captchaResponse.json();
      if (!captchaData.success) {
        return res.status(400).json({ success: false, message: "Captcha verification failed." });
      }
      const commentId = uuidv4();
      await knex("postComments").insert({
        commentId,
        postId,
        name,
        body,
        createdAt: new Date(),
        published: 0, // save as not published
      });
      redis.del(process.env.CACHE_ROOT_KEY + "comments:" + postId);
      return res.json({ success: true, message: "Comment submitted successfully!" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "An error occurred while submitting the comment." });
    }

  });

}
