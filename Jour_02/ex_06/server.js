const express = require('express')
const app = express()
fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mern-pool', { useUnifiedTopology: true }, function(err, client) {
    if (err) { console.log("Connection failed.") } else { console.log("Connection Successfull") };

    var db = client.db('mern-pool');
    // db.collection('students').findOne({}, function(findErr, result) {
    // if (findErr) throw findErr;
    //     if (result) {
    //         console.log("oups");
    //     } else {
    //         console.log("no");
    //     }
    //     // console.log(result.firstname);


    //     client.close();
    // });

    app.get('/', function(req, res) {
        res.write("wesh");
    })


});



app.listen(4242);