const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID
require('dotenv').config
const port = process.env.PORT || 5000
// console.log(process.env.DB_USER)


const app = express()
app.use(cors())
app.use(bodyParser.json())



const uri = "mongodb+srv://bookShop-assign-10:7KYrGtFYB0WCSr55@cluster0.dfncg.mongodb.net/bookShop?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("checking error", err)
    const bookCollection = client.db("bookShop").collection("addBook");

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
    app.delete('/deleteBook/:id', (req, res) => {
        console.log(req.params.id)
    })

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})