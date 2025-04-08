import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const userAgent = req.headers["user-agent"];

  res.render("index", { title: `Express : ${process.env.TEXT} ${userAgent}` });
});

export default router;
