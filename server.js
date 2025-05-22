import express from 'express';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

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
    title: String,
    ref: String,
    org: String,
    auth: Boolean
});

const Model = mongoose.model(STUDENTS, schema);

let student_id = null;

app.post('/api/submit/:cin', async (req, res) => {
    const cin = req.params.cin;
    const { titre, ref, org } = req.body;

    console.log(org);

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

app.listen(PORT, HOSTNAME, () => {
    console.log('Server is running on port 3000');
});