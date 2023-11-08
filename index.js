
const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 5000
app.use(cors({
  origin: [
    "http://localhost:5173"
  ],
  credentials: true
}))
app.use(express.json())


// online-marketPlace
// uKK3YKit57VIwdd6

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const categoryCollection = client.db('online-marketDB').collection('category')
    const bidsCollection = client.db('online-marketDB').collection('myBids')
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // auth related api
    app.post('/jwt', async (req, res) => {
      const user = req.body
      console.log('token token', user)
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'none'
        })
        .send({ success: true })
    })
    app.post('/logout', async (req, res) => {
      const user = req.body
      console.log("users login",user)
      res.clearCookie('token', { maxAge: 0 })
        .send({ success: true })
    })

    app.post('/category', async (req, res) => {
      const addJob = req.body
      console.log(addJob)
      const result = await categoryCollection.insertOne(addJob)
      res.send(result)
    })
    app.post('/myBids', async (req, res) => {
      const mybids = req.body
      const result = await bidsCollection.insertOne(mybids)
      res.send(result)
      console.log(mybids)
    })

    //email data 
    app.get('/category', async (req, res) => {
      console.log(req.query.email)
      let query = {}
      if (req.query.email) {
        query = { email: req.query.email }
      }
      const result = await categoryCollection.find(query).toArray()
      res.send(result)

    })
    // bids User_Email
    app.get('/myBids', async (req, res) => {
      console.log(req.query.email)
      let query = {}
      if (req.query.email) {
        query = { user_Email: req.query.email }
      }
      const result = await bidsCollection.find(query).toArray()
      res.send(result)
    })
    // bids Owner_USER
    app.get('/myBids', async (req, res) => {
      console.log(req.query.email)
      let query = {}
      if (req.query.email) {
        query = { owner_Email: req.query.email }

      }
      const result = await bidsCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/category/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      // option
      const user = await categoryCollection.findOne(query)
      res.send(user)
    })
    app.get('/category', async (req, res) => {
      const cursor = categoryCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/myBids', async (req, res) => {
      const cursor = bidsCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.put('/category/:id', async (req, res) => {
      const id = req.params.id
      const updateData = req.body
      console.log(updateData)
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateCategory = {
        $set: {
          email: updateData.email,
          Job_Title: updateData.Job_Title,
          Deadline: updateData.Deadline,
          Description: updateData.Description,
          Minimum_price: updateData.Minimum_price,
          Maximum_price: updateData.Maximum_price,
          category: updateData.category,
        }
      }
      const result = await categoryCollection.updateOne(filter, updateCategory, options)
      res.send(result)
    })
    app.delete('/category/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await categoryCollection.deleteOne(query)
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