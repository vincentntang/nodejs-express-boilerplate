const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();
require('dotenv').config();

mongoose
  .connect(process.env.MONGOOSE_URI)
  .then(() => {
    console.log('Connect to database!');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-Width, Content-Type, Accept',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  next(); // Like VueNextTick
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  // When we save data, we return mongooseID back to store on frontend
  console.log('AddPost Backend');
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id,
    });
  });
});

// The first path are middleware
app.get('/api/posts', (req, res, next) => {
  // const posts = [
  Post.find().then(documents => {
    // you need to await the results coming from db
    console.log('documents', documents);
    res.status(200).json({
      message: 'Post fetched succesfully!',
      posts: documents,
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  // Post.deleteOne is mongoDB, mongooose generates the _id
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  });
});

module.exports = app;
