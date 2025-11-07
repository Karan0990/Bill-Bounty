const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: "dd0ckmtsp",
    api_key: "169728499492996",
    api_secret: "GpJwVIS-1e4QASytTXMXgQwR1Zo"
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith("video/");

        return {
            folder: "e-commerce",
            allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "avi", "mov", "mkv"],
            resource_type: isVideo ? "video" : "image",
            public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        };
    },
});

module.exports = {
    cloudinary,
    storage,
};
