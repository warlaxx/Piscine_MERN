const express = require('express');
const app = express();

app.get('/name/:name', function(req, res) {
    res.send("Hello " + req.params.name);
})

app.get('/name/', function(req, res) {
    res.send("Hello unkown");
})

app.listen(4242, function() {
    console.log('ça fonctionne dans le port 4242')
})