const express = require('express');
const app = express();
const rateLimiter = require("./redisRateLimiter");

app.use(rateLimiter);

app.get('/', function (req, res) {
 return res.send('Hello world');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);

console.log(`Running in port ${PORT}`)