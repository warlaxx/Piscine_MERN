const express = require('express');
const app = express();
var mymern_module = require('mymern_module');

const url = require('url');
const querystring = require('querystring');

app.get('/files/:name', function(req, res) {
    mymern_module.read(req.params.name, function(err, data) {
        console.log(data);
    });
});

app.post('/files/:name', function(req, res) {
    mymern_module.create(req.params.name, function(err, data) {
        console.log(data);
    });
});

app.put('/files/:name/:content', function(req, res) {
    mymern_module.update(req.params.name, req.params.content, function(err, data) {
        console.log(data);
    });
});

app.delete('/files/:name', function(req, res) {
    mymern_module.delete(req.params.name, function(err, data) {
        console.log(data);
    });
});

app.listen(4000);