const express = require('express');
const app = express();

const url = require('url');
const querystring = require('querystring');


app.get('/name/:name', function(req, res) {
    res.send("Hello " + req.params.name + ", you are " + req.query.age + " yo");
});

app.get('/name/', function(req, res) {
    res.send("Hello unkown, i don't know your age");
})

app.listen(4242);