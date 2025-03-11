import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const origin = req.get("origin") || req.get("referer") || req.get("referer");
  // console.log(req.headers);

  res.render("index", { title: `Express : ${origin}` });
});

export default router;
