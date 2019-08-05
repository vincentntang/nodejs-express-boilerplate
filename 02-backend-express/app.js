const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log('This was log inside the local terminal');
  next();
});

app.use((req, res, next) => {
  res.send('Hello from express, seen on the website!');
});

module.exports = app;
