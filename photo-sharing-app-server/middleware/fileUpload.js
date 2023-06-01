let fs = require("fs-extra");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = `uploads/${req.headers["user-id"]}/`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const uploadFile = multer({ storage: storage });

module.exports = uploadFile;
