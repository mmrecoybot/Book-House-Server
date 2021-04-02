const express = require("express");
const app = express();
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4500;
const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7gc6n.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


client.connect((err) => {
  console.log("success", err);
  const productCollection = client.db("bookdb").collection("bookcol");
  const productOrderCollection = client.db("bookdb").collection("orderInfo");

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    console.log(product);
    productCollection.insertOne(product).then((result) => {
      console.log("Product Image", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/showbook", (req, res) => {
    productCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });


app.post('/addOrder', (req, res) => {
  const orderDetails = req.body;
    console.log(orderDetails)
  productOrderCollection.insertOne(orderDetails)
  .then(result => {
    res.send(result.insertedCount > 0)
  })
})

   app.get('/orders', (req, res) => {
        const qEmail = req.query.email;
        productOrderCollection.find({ email: qEmail })
            .toArray((err, documents) => {
                res.send(documents)
                
            })
    })

app.delete('/delete/:id', (req, res) => {
  const id = ObjectID(req.params.id);
  productCollection.deleteOne({_id: id})
  .then(result => {
    // res.send(result);
    console.log(result);
  })
})



});

app.listen(port);
