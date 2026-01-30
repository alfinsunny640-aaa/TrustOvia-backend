

const multer = require("multer");

// store file in memory (safe & simple)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

module.exports = upload;


