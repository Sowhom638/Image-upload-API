const express = require("express");
const { initializeDatabase } = require("./db.connect");
const multer = require("multer");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const cors = require("cors");
const {ImageModel} = require("./models/images")

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
initializeDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// multer
const storage = multer.diskStorage({});
const upload = multer({storage});

// API Endpoint
app.post("/upload", upload.single("image"), async (req, res)=>{
    try {
        const file = req.file;
        if(!file) return res.status(400).send("To file uploaded");

        // upload to cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "uploads"
        })
        const newImage = new ImageModel({imageUrl: result.secure_url });
        await newImage.save();

        res.status(200).json({
            message: "Image Uploaded Successfully",
            imageUrl: result.secure_url
        });
    } catch (error) {
        res.status(500).json({
            message: "Image Upload Failed", error: error.message });
    }
})

app.get("/images", async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch images", error: error });
  }
});

app.listen(process.env.PORT||3000, ()=>{console.log("Server is running");
})