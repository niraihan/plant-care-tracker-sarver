
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@raihanprojects.cky7elr.mongodb.net/?retryWrites=true&w=majority&appName=RaihanProjects`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // await client.connect();
        const db = client.db("plantCareDB");
        const plantCollection = db.collection("plants");

        // POST: Add a new plant
        app.post("/plants", async (req, res) => {
            const plant = req.body;
            const result = await plantCollection.insertOne(plant);
            res.send(result);
        });

        // GET: All plants  by email
        
        app.get("/plants", async (req, res) => {
            const email = req.query.email;
            const query = email ? { userEmail: email } : {};
            const plants = await plantCollection.find(query).toArray();
            res.send(plants);
        });
        app.get("/new-plants", async (req, res) => {
            
            const plants = await plantCollection.find().sort({ _id: -1 }).limit(6).toArray();
            res.send(plants);
        });

        // GET: A single plant by ID
        app.get("/plants/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const plant = await plantCollection.findOne(query);
            res.send(plant);
        });

        // PUT: Update a plant by ID
        app.put("/plants/:id", async (req, res) => {
            const id = req.params.id;
            const updatedPlant = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedPlant,
            };
            const result = await plantCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // DELETE: Remove a plant by ID

        app.delete("/plant/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await plantCollection.deleteOne(query);
            res.send(result);
        });

        console.log(" MongoDB connected and routes are live.");
    } finally {

        // Do not close client in dev server
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("🌿 Plant Care Tracker Server is Running");
});

app.listen(port, () => {
    console.log(` Server is running on port ${port}`);
});
