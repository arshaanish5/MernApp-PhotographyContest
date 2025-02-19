const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // Import Cloudinary configuration

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "contest_photos", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => Date.now() + "-" + file.originalname, // Unique filename
  },
});

// Multer upload middleware
const upload = multer({ storage: storage});

module.exports = upload;
