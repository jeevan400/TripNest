// REQUIRE THESE TWO LIBERARIES CLOUDINARY AND MULTER-STORAGE-CLOUDINARY
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// CONFIGURE SOME THINGS
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// TO DEFINE THE STORAGE
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "tirpnest_DEV",
        allowformate: ["png", "jpg", "jpeg"],
    },
});

// exports these two things cloudinary and storage

module.exports = {
    cloudinary,
    storage
};