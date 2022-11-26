const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
require('dotenv').config();

const port = process.env.PORT || 5000

// midleware 

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i4cqwjk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {

        const categoryCollection = client.db('resale-laptop').collection('allCategory');
        const bookingCollection = client.db('resale-laptop').collection('bookingProduct');
        const usersCollection = client.db('resale-laptop').collection('users');

        app.get('/category/:brand', async (req, res) => {
            const brand = req.params.brand;
            console.log(brand);
            const query = { brand: brand }
            const category = await categoryCollection.find(query).toArray();
            res.send(category);
        })

        app.post('/category', async (req, res) => {
            const product = req.body;
            const result = await categoryCollection.insertOne(product);
            res.send(result);

        })


        app.get('/category', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            const query = { email: email }
            const product = await categoryCollection.find(query).toArray();
            res.send(product);
        })

        app.get('/myOrder', async (req, res) => {
            const email = req.query.email;

            const query = { email: email };
            const order = await bookingCollection.find(query).toArray();
            res.send(order);
        })

        app.post('/booking', async (req, res) => {
            const bookingProduct = req.body;
            const result = await bookingCollection.insertOne(bookingProduct);
            res.send(result);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            res.send(user);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

    }

    finally {

    }

}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('resale server running')
})


app.listen(port, () => console.log('server running on port', port))