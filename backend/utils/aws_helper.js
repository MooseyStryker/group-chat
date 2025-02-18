const multer = require('multer')
const multerS3 = require('multer-s3')
const { DeleteObjectCommand, S3Client } = require('@aws-sdk/client-s3')

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    }
})

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname)
        }
    })
}).single("image")

const deletePhoto = async (photo) => {
    const photoLink = photo.imgAWSLink
    const urlParts = photoLink.split('/')
    const objectKey = urlParts.splice(3).join('/')

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: objectKey
    }

    try{
        await s3.send(new DeleteObjectCommand(params))

    } catch (error) {
        throw new Error(error)
    }
}



module.exports = {
    upload,
    deletePhoto
}
