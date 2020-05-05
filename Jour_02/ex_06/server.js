const express = require('express')
const app = express()
fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mern-pool', { useUnifiedTopology: true }, function(err, client) {
    if (err) { console.log("Connection failed.") } else { console.log("Connection Successfull") };

    var db = client.db('mern-pool');
    app.get('/', function(req, res) {
        db.collection("students").find({ validated: "in progress" }).sort({ lastname: 1 }).toArray(function(err, result) {
            if (err) throw err;
            res.json(result)
            client.close();
        });
    })
});

app.listen(4242);