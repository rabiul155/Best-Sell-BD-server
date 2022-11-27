const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // add product by seller

        app.post('/category', async (req, res) => {
            const product = req.body;
            const result = await categoryCollection.insertOne(product);
            res.send(result);

        })

        //seller added product to advertise 
        app.put('/category/:id', async (req, res) => {
            const advertise = req.body;
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    advertise: true
                }
            }
            const result = await categoryCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

        app.get('/advertise', async (req, res) => {
            const query = { advertise: true };

            const product = await categoryCollection.find(query).toArray();
            res.send(product)
        })

        //  send seller adde product 
        app.get('/category', async (req, res) => {
            const email = req.query.email;
            console.log(email)
            const query = { email: email }
            const product = await categoryCollection.find(query).toArray();
            res.send(product);
        })

        // delete product by selle 

        app.delete('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await categoryCollection.deleteOne(query);
            res.send(result)
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

        app.get('/users', async (req, res) => {
            const role = req.query.role;
            const query = { role: role }
            console.log(query)
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
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