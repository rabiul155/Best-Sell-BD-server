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

        app.get('/category/:brand', async (req, res) => {
            const brand = req.params.brand;
            console.log(brand);
            const query = { brand: brand }
            const category = await categoryCollection.find(query).toArray();
            res.send(category);
        })
        app.get('/category', async (req, res) => {
            const query = {}
            const category = await categoryCollection.find(query).toArray();
            res.send(category);
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