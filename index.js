
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
        //-----------------------Plant--------------------------------------
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

            const plants = await plantCollection.find().sort({ _id: -1 }).limit(8).toArray();
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
        app.delete("/plants/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await plantCollection.deleteOne(query);
            res.send(result);
        });
        //---------------------------subscriber----------------------------
        // ✅ Newsletter Collection
        const newsletterCollection = db.collection("newsletterSubscribers");

        // ✅ POST: Add a new subscriber
        app.post("/newsletter", async (req, res) => {
            const { email } = req.body;

            if (!email || !/\S+@\S+\.\S+/.test(email)) {
                return res.status(400).json({ message: "Invalid email address" });
            }

            try {
                const existing = await newsletterCollection.findOne({ email });
                if (existing) {
                    return res.status(409).json({ message: "Already subscribed" });
                }

                const result = await newsletterCollection.insertOne({
                    email,
                    subscribedAt: new Date(),
                });

                res.send(result);
            } catch (err) {
                console.error("Newsletter Subscription Error:", err);
                res.status(500).json({ message: "Server error" });
            }
        });
        // ✅ GET: All newsletter subscribers
        app.get("/newsletter", async (req, res) => {
            try {
                const subscribers = await newsletterCollection
                    .find()
                    .sort({ subscribedAt: -1 }) // latest first
                    .toArray();
                res.send(subscribers);
            } catch (error) {
                console.error("Failed to fetch subscribers:", error);
                res.status(500).json({ message: "Server error" });
            }
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
