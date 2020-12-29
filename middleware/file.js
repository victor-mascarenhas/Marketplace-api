const MSGS = require('../messages');
const AWS = require('aws-sdk');
const config = require('config');
const fs = require('fs');
const slugfy = require('../service/slugfy');


module.exports = async function (req, res, next) {
    try {

        const BUCKET_NAME = process.env.S3_BUCKET_NAME || config.get('S3_BUCKET_NAME')
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || config.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || config.get('AWS_SECRET_ACCESS_KEY')
        });
        const folder = req.baseUrl.replace("/", "")

        if (!req.files) {
            next()
        } else {
            let photo = req.files.photo
            const name = slugfy(photo.name)
            req.body.photo_name = name

            if (photo.mimetype.includes('image/')) {
                
                const file = await photo.mv(`./uploads/${name}`)
                const params = {
                    Bucket: BUCKET_NAME,
                    ACL: 'public-read',
                    Key: `${folder}/${name}`,
                    Body: fs.createReadStream(`./uploads/${name}`)
                };
                s3.upload(params, function (err,data){
                    if(err){
                        console.error(err);
                        res.status(500).send(err);
                    }else{
                        console.log(`File uploaded successfully. ${data.Location}`);
                        fs.unlinkSync(`./uploads/${name}`)
                        next()
                    }
                })            
            } else {
                res.status(400).send({ message: MSGS.FILE_INVALID_FORMAT});
            }
        }
    } catch (err) {
        res.status(500).send({ "error": err.message })
    }
}
