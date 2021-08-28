import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import Course from "../models/course"
import slugify from "slugify"
import {readFileSync} from 'fs'

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
} 

const S3 = new AWS.S3(awsConfig)


export const uploadImage = async (req, res) => {
    // console.log(req.body)
    try {
        const { image } = req.body
        if (!image) return res.status(400).send("No image")
    // prepare the image 
        const base64Data = new Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ""), "base64")
        const type = image.split(';')[0].split('/')[1];
        const params = {
            Bucket: "udemy-bucket01",
            Key: `${nanoid()}.${type}`,
            Body: base64Data,
            ACL: "public-read",
            ContentEncoding: "base64",
            ContentType:`image\${type}`,

        }

        // Upload to s3
        S3.upload(params, (err, data) => {
            if (err) {
                console.log(err)
                return res.sendStatus(400)
            }
            console.log(data)
            res.send(data)
        })
        
    }catch(err){console.log(err)}
}

export const removeImage = async (req, res) => {
    try {
        const { image } = req.body;
        // image params 
        const params = {
            Bucket: image.Bucket,
            Key: image.Key,

        }
        // Send remove request to s3 
        S3.deleteObject(params, (err, data) => {
            if (err) {
                console.log(err)
                res.sendStatus(400)
            }
            res.send({ok:true})
        })
    } catch (err) {
        console.log(err)
    }
}

// React Course for Beginners
// react-course-for-beginners

export const create = async (req, res) => {

    // console.log("CREATE COURSE")
    // return;
    try {
        const alreadyExist = await Course.findOne({ slug: slugify(req.body.name.toLowerCase()) })
        if (alreadyExist) return res.status(400).send("Title is taken")
        
        const course = await new Course({
            slug: slugify(req.body.name.toLowerCase()),
            instructor: req.user._id,
            ...req.body,

        }).save();
        res.json(course)
    } catch (err) {
        console.log(err)
        return res.status(400).send("Course create failed. Try again.")
    }
}

export const read = async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug }).populate('instructor', '_id.name').exec()
        res.json(course)
    } catch (err) {
        console.log(err)
    }
    
}
export const uploadVideo = async (req, res) => {
    try {
        const { video } = req.files
        if (!video) return res.status(400).send("No video")

        // video params
        const params = {
            Bucket: "udemy-bucket01",
            Key: `${nanoid()}.${video.type.split('/')[1]}`, //
            Body: readFileSync(video.path),
            ACL: 'public-read',
            ContentType: video.type,
        }
        // Upload to S3
        S3.upload(params, (err, data) => {
            if(err) {
                console.log(err)
                res.sendStatus(400)
            }
            console.log(data)
            res.send(data)
        })
        
    }
    catch (err) {
        console.log(err)
     }
}

export const removeVideo = async (req, res) => {
    try {
        const { video } = req.body
        console.log(video)
        return;
        if (!video) return res.status(400).send("No video")

        // video params
        const params = {
            Bucket: "udemy-bucket01",
            Key: `${nanoid()}.${video.type.split('/')[1]}`, //
            Body: readFileSync(video.path),
            ACL: 'public-read',
            ContentType: video.type,
        }
        // Upload to S3
        S3.upload(params, (err, data) => {
            if(err) {
                console.log(err)
                res.sendStatus(400)
            }
            console.log(data)
            res.send(data)
        })
        
    }
    catch (err) {
        console.log(err)
     }
}