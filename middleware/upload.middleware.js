const multer = require("multer");
const uploadImage = multer({ dest: "public/images/" });
module.exports = uploadImage;
