const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;
app.use(express.static(__dirname));
mongoose.connect('mongodb+srv://shivanisingh:shivani%40123@projects.lscvfeo.mongodb.net/?retryWrites=true&w=majority&appName=Projects', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));
const User = require('./models/new');


const connect = mongoose.connection;

connect.on('error', console.error.bind(console, 'mongodb error'))

connect.once('open', () => {
  console.log('connected TO mongoDB')
})

app.get('/', (req, res) => {
  res.send('Hello, Blog!');

})

app.post('/authors', (req, res) => {
  try {

    console.log(req.body);
    const user = new User(req.body);
    user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/authors', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users); 
  } catch (err) {
    res.status(400).send(err); 
  }
});

// Route to update an author by ID
app.put('/authors/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // The data to update

  try {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: 'Author not found' });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});


app.get('/authors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: 'Author not found' });
    }
  } catch (err) {
    res.status(400).send(err); 
  }
});

app.delete('/authors/:id', async(req,res)=>{
  const {id} = req.params;
  try{
    const user = await User.findOneAndDelete(id);
    if(user){
      res.status(200).send({message:'Author deleted successfully'})
    }
    else{
      res.status(404).send({message:'Author not found'})
    }
    
  }
  catch(err)
  {
    res.status(400).send(err)
  }
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});