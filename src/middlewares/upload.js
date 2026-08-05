const multer = require('multer');
const config = require('../config/environment');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: config.upload.maxFileSize },
    fileFilter: (req, file, callback) => {
        const extension = file.mimetype.split('/')[1];

        if (config.upload.allowedImageTypes.includes(extension)) {
            callback(null, true);
        } else {
            callback(new Error('Only approved image formats are allowed.'));
        }
    },
});

module.exports = upload;