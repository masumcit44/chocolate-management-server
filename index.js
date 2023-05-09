const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//chocolate 01796097083


console.log();

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bs8dc9c.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const chocolateCollection = client.db('chocolateDB').collection('chocolate')

    app.get('/chocolate',async(req,res)=>{
      const cursor =  chocolateCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/chocolate/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = { _id:new ObjectId(id) }
      const result = await chocolateCollection.findOne(filter)
      res.send(result)
    })

    app.post('/chocolate',async(req,res)=>{
        const chocolate = req.body;
        console.log(chocolate);
        const result = await chocolateCollection.insertOne(chocolate)
        res.send(result)
      })

    app.put('/chocolate/:id',async(req,res)=>{
      const id = req.params.id;
      const updatedChocolate = req.body;
      console.log(updatedChocolate);
      const query = {_id: new ObjectId(id)}
      const options = { upsert : true}
      const chocolate = {
        $set: {
          name : updatedChocolate.name,
          country : updatedChocolate.country,
          category : updatedChocolate.category,
          photo : updatedChocolate.photo
        },
      }
      const result =  await chocolateCollection.updateOne(query,chocolate,options)
      res.send(result)
    })

    app.delete('/chocolate/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id) }
      const result = await chocolateCollection.deleteOne(query)
      res.send(result)
    })

  

    



    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("chocholate server is running");
});

app.listen(port, () => {
  console.log(`chocolate server is running on port: ${port}`);
});
