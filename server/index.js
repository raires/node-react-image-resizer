import express  from "express";
import multer from "multer";
import bodyParser from "body-parser";
import sharp from "sharp";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Create multer object
const imageUpload = multer({});


app.post('/imagebase64', imageUpload.single('myimage'), async (req, res) => { 
    if (!req.file) { return res.sendStatus(400).send('No file attached'); }

    if (req.file.mimetype !== 'image/png' 
        && req.file.mimetype !== 'image/jpeg' 
        && req.file.mimetype !== 'image/jpg' 
        && req.file.mimetype !== 'image/gif') {
            return res.status(400).send('Unsupported file type.');
    }

    const imgBuffer = req.file.buffer;
    const image = await sharp(imgBuffer);

    if (!imgBuffer) { return res.sendStatus(400); }

    const metadata = await image.metadata()

    const quality = req.body.quality || 50;
    const width = req.body.width || metadata.width;
    const height = req.body.height || metadata.height;

    const semiTransparentRedPng = await sharp(imgBuffer)
        .png({ quality: Number(quality) })
        .resize(Number(width),Number(height),{fit:'contain'})
        .toBuffer();

    const baseImg = await semiTransparentRedPng.toString('base64');

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    res.end(baseImg); 
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});