const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db =knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'StevenCoding',
    port: 5432,
    password: '',
    database: 'smart-brain',
  },
});

db.select('*').from('users').then(data => {
	// console.log(data);
});

const app = express();
app.use(cors());

app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/', (req, res) => {res.send(database.users)})

app.post('/signin', signin.handleSignin(db, bcrypt))

app.post('/register', register.handleRegister(db, bcrypt))

app.get('/profile/:id', profile.handleProfileGet(db))

app.put('/image', image.handleImage(db))

app.post('/api/clarifai', async (req, res) => {
  const { imageUrl, requestOptions } = req.body;
  const PAT = 'f994193246d54eff9d623415ba286671'; // PAT stays only on server

  try {
    // Add the Authorization header with PAT on the server side
    const response = await fetch("https://api.clarifai.com/v2/models/face-detection/outputs", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT, // PAT added here on server
        'Content-Type': 'application/json'
      },
      body: requestOptions.body // Use the body from frontend request
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Clarifai API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Clarifai API error:', error);
    res.status(500).json({ error: 'Failed to process image: ' + error.message });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});

/*
--Plan-- 
/ --> res = this is working
/signin --> POST = success or fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/