const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

// UEdOEiAOIg4O0qsT
// Assignement10
// console.log(process.env.DB_USER)


// const uri = "mongodb+srv://<db_username>:<db_password>@raihanprojects.cky7elr.mongodb.net/?retryWrites=true&w=majority&appName=RaihanProjects";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@raihanprojects.cky7elr.mongodb.net/?retryWrites=true&w=majority&appName=RaihanProjects`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})