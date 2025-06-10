import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import 'dotenv/config'

const HOSTNAME = process.env.APP_HOSTNAME;
const PORT = process.env.APP_PORT;
const STUDENTS = process.env.MONGO_STUDENTS;
const ORGS = process.env.MONGO_ORGS;

const app = express();
app.use(cors());

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
});

const SocieteSchema = new mongoose.Schema({
    societe: String
});

const Students = mongoose.model(STUDENTS, schema);
const Societes = mongoose.model(ORGS, SocieteSchema);

// API to get societes
app.get('/api/getSociete', async (req, res) => {
    try {
        const societes = await Societes.find().sort({ societe: 1 });
        res.json(societes);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

app.get('/api/student', async (req, res) => {
    const cin = req.query.cin;
    try {
        const student = await Students.findOne({ cin: cin });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/submit/:cin', async (req, res) => {
    const cin = req.params.cin;
    const { titre, ref, org } = req.body;

    try {
        await Students.findOneAndUpdate(
            { cin: cin },
            { $set: { titre: titre, ref: ref, org: org } },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error updating document:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/var/isetbz/uploads/raia/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 30 * 1024 * 1024 } // Limit to 30MB
});


// Handle form submission
app.post('/', upload.single('file'), (req, res) => {

    const file = req.file;

    const maxSizeInBytes = 30 * 1024 * 1024; // 30 MB

    try {

        if (file) {
            if (file.mimetype !== 'application/pdf') {
                res.json({ msg: 'Choisissez un fichier PDF.' });
                return;
            } else {
                if (file.size > maxSizeInBytes) {
                    res.json({ msg: 'Taille du fichier trop grande.' });
                    return;
                } else {
                    console.log('File uploaded:', file.originalname);
                    res.status(200).json({ msg: "Fichier chargé correctement." });
                    return;
                }
            }
        } else {
            res.status(404).json({ msg: 'Veuillez charger votre rapport.' });
            return;
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error' });
    }
});


app.listen(PORT, HOSTNAME, () => {
    console.log(`Server is running on port ${PORT}`);
});