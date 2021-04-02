const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID
require('dotenv').config();
const port = process.env.PORT || 5000

console.log(process.env.DB_USER)


const app = express()
app.use(cors())
app.use(bodyParser.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dfncg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("checking error", err)
    const bookCollection = client.db("bookShop").collection("addBook");
    const ordersCollection = client.db("bookShop").collection("orders");

    // Read Data for home, manage-book.
    app.get("/books", (req, res) => {
        bookCollection.find()
            .toArray((err, items) => {
                res.send(items)
                // console.log('from database', items)
            })
    })


    // Posting Data from add book page
    app.post('/addBook', (req, res) => {
        const newBook = req.body
        bookCollection.insertOne(newBook)
            .then(result => {
                console.log('inserted count', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })

    // Read data for order page
    app.get("/book/:bookId", (req, res) => {
        bookCollection.find({ _id: ObjectID(req.params.bookId) })
            .toArray((err, item) => {
                res.send(item);
            })
    })

    // Delete Data from the database
    app.delete('/deleteBook/:deleteBookID', (req, res) => {
        console.log(req.params.deleteBookID)
        // bookCollection.deleteOne({ _id: ObjectID(req.params.deleteBookID) })
        //     .toArray((item) => {
        //         res.send(item);
        //     })
    })

    // Add order in the database
    app.post('/addOrder', (req, res) => {
        const order = req.body
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/order', (req, res) => {
        ordersCollection.find({ email: req.query.email })
            .toArray((err, order) => {
                res.send(order)
            })
    })

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})