const cloudinary = require('../config/cloudinary');

const uploadImage = (buffer, folder = 'poshaarya') =>
    new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [
                    { quality: 'auto', fetch_format: 'auto' },
                ],
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });

const deleteImage = (publicId) =>
    cloudinary.uploader.destroy(publicId, { resource_type: 'image' });

module.exports = { uploadImage, deleteImage };