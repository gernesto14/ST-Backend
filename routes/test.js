import express from "express";
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  const origin = req.get("origin") || req.get("referer") || req.get("referer");
  // console.log(req.headers);

  const headers = req.headers;
  console.log("Origin: ", headers.origin);
  console.log("Referer: ", headers.referer);
  console.log("Host: ", headers.host);

  res.send(req.headers);
});

export default router;
