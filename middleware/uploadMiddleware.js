// const multer = require("multer");




// const storage = multer.diskStorage({
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });

// const upload = multer({ storage });

// module.exports = upload;\

// const multer = require("multer");
// const path = require("path");

// // TEMP local storage (required for Cloudinary upload)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // 👈 REQUIRED
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;

const multer = require("multer");

// store file in memory (safe & simple)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

module.exports = upload;


