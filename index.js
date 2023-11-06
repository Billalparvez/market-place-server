
const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())


// online-marketPlace
// uKK3YKit57VIwdd6

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ktupw59.mongodb.net/?retryWrites=true&w=majority`;

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
    const categoryCollection=client.db('online-marketDB').collection('category')
    const addJobCollection=client.db('online-marketDB').collection('addJob')
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    app.post('/category',(req,res)=>{
        const category=req.body;
        console.log(category)
        res.send(category)
    })
    app.post('/addJob',async(req,res)=>{
      const addJob=req.body
      console.log(addJob)
      const result=await addJobCollection.insertOne(addJob)
      res.send(result)
    })
    app.get('/addJob',async (req,res)=>{
        const cursor=categoryCollection.find()
        const result=await cursor.toArray()
        res.send(result)
    })
    app.get('/category',async (req,res)=>{
        const cursor=categoryCollection.find()
        const result=await cursor.toArray()
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World bangla!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})