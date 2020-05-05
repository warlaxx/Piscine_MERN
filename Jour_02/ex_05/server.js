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
        fs.readFile('form.html', 'utf8', function(err, html) {
            res.writeHeader(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
        });
    })

    app.post('/', function(request, response) {
        console.log(request.body.student.lastname);
        console.log(request.body.student.email);
        db.collection('students').insertOne({
            lastname: request.body.student.lastname,
            firstname: request.body.student.firstname,
            email: request.body.student.email,
            phone: request.body.student.phone,
            validated: "in progress",
            admin: false
        }, function(err, inserted) {
            if (err) {
                console.log("Failed to save the collection")
            } else {
                console.log("Collection saved")
            }
        });
    });
});



app.listen(4242);