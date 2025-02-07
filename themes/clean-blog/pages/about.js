
export default function about(app, config) {
  app.get("/about", async (req, res) => {
    res.render('about', { themePath: config.path });
  });
}
