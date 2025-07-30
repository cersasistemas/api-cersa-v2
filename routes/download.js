const express = require("express");
const router = express.Router();

const {decodeToken} = require("../scripts/jwt");

router.get("/", async (req, res, next) => {
  const file = `/srv/app/storage/docentes/${req._parsedUrl.query.toString().trim().substring(5)}`;
  res.download(file);
});

module.exports = router;
