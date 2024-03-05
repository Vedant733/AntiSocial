const fs = require('fs');

const absPath = 'F:/Projects/SocialMediaMERN/backend/uploads/';

const GetPhotoByPath = (path, currentData) => {
    if (!path) return new Promise(resolve => resolve({ data: currentData }))
    return new Promise((resolve, reject) => {
        fs.readFile(absPath + path, (err, data) => {
            if (err) {
                console.error('Error reading image file:', err);
                reject(err);
            } else {
                const base64Image = Buffer.from(data).toString('base64');
                if (!currentData) resolve({ image: base64Image })
                resolve({ image: base64Image, data: currentData });
            }
        });
    })
}
module.exports = { GetPhotoByPath }