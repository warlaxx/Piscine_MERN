const express = require('express')
const app = express()
fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const url = require('url');
const querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mern-pool', { useUnifiedTopology: true }, function(err, client) {
    if (err) { console.log("Connection failed.") } else { console.log("Connection Successfull") };

    var db = client.db('mern-pool');
    app.get('/users/', function(req, res) {
        console.log(req.query.sort);
        sort = {};
        if (req.query.sort == "ln") {
            sort = { lastname: 1 }

        } else if (req.query.sort == "fn") {
            sort = { firstname: 1 }
        }
        db.collection("students").find({ validated: "in progress" }).sort(sort).toArray(function(err, data) {
            if (err) throw err;
            let result = '<table><tr><th><a href="?sort=ln">Lastname</a></th><th></th><a href="?sort=fn">Firstname</a></tr>';
            for (let i in data) {
                result += "<tr><td>" + data[i].lastname + "</td><td>" + data[i].firstname + "</td></tr>";
            }
            result += '</table>';
            res.send(result);
        });
    })
});

app.listen(4242);