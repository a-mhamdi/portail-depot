import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import 'dotenv/config'

const HOSTNAME = process.env.APP_HOSTNAME;
const PORT = process.env.APP_PORT;
const STUDENTS = process.env.MONGO_STUDENTS;
const ORGS = process.env.MONGO_ORGS;

const app = express();

app.use(express.json());
app.use(express.static('public'));

const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`;
mongoose.connect(uri)

// Create a schema and model for the collection
const schema = new mongoose.Schema({
    cin: String,
    titre: String,
    ref: String,
    org: String,
    auth: Boolean
});

const Model = mongoose.model(STUDENTS, schema);

app.post('/api/submit/:cin', async (req, res) => {
    const cin = req.params.cin;
    const { titre, ref, org } = req.body;

    try {
        await Model.findOneAndUpdate(
            { cin: cin },
            { $set: { titre: titre, ref: ref, org: org, auth: false } },
            { upsert: true }
        );

    } catch (error) {
        console.error('Error updating document:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

});

// Configure multer for PDF uploads only
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/isetbz/uploads/raia/') // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Only allow PDF files
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Upload endpoint
app.post('/upload', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    res.json({
        message: 'PDF uploaded successfully',
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
    });
});




app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running on port ${PORT}`);
});