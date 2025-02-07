
export default function contact(app, config) {
  app.get("/contact", async (req, res) => {
    res.render('contact', { themePath: config.path });
  });
}
