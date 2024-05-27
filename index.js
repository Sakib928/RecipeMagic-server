const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1towayy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const userCollection = client.db('Recipes').collection('users');
        const recipeCollection = client.db('Recipes').collection('recipes');

        app.post('/addRecipes', async (req, res) => {
            const recipe = req.body;
            const result = await recipeCollection.insertOne(recipe);
            res.send(result);
        })

        app.post('/profile', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.post('/check', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const result = await userCollection.findOne(query);
            if (result) {
                res.send({ status: false })
            } else {
                res.send({ status: true })
            }
        })

        app.get('/recipes', async (req, res) => {
            const result = await recipeCollection.find().toArray();
            res.send(result);
        })

        app.get('/showRecipes', async (req, res) => {
            const projection = { "recipeName": 1, recipePhoto: 1, purchasedBy: 1, creatorEmail: 1, country: 1 };
            const result = await recipeCollection.find().project(projection).toArray();
            res.send(result);
        })
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("server is running for recipe magic")
})

app.listen(port, () => {
    console.log("server is running for recipe magic")
})