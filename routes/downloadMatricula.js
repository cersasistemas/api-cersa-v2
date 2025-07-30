const express = require("express");
const router = express.Router();

const {decodeToken} = require("../scripts/jwt");

router.get("/", async (req, res, next) => {
  let file = req._parsedUrl.query.toString().trim().substring(5)
  let extension = file.split('.')
  extension = extension[1]
  let path = ''

  switch (extension) {
    case "pdf":
      path = `/srv/app/storage/matriculas/${file}`
      break;
    case "png":
    case "jpeg":
      path = `/srv/app/public/images/matriculas/${file}`
      break;
  }

  res.download(path);
});

module.exports = router;
