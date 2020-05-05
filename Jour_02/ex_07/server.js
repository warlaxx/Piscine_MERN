const express = require('express')
const app = express()
fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/mern-pool', { useUnifiedTopology: true }, function(err, client) {
    if (err) { console.log("Connection failed.") } else { console.log("Connection Successfull") };

    var db = client.db('mern-pool');
    app.get('/users/', function(req, res) {
        sort = {};
        if (req.query.sort == "ln") {
            sort = { lastname: 1 }

        } else if (req.query.sort == "fn") {
            sort = { firstname: 1 }
        }
        db.collection("students").find({}).sort(sort).toArray(function(err, data) {
            if (err) throw err;
            let result = '<form method="post" action="/users/create"><input type="text" name="student[firstname]"><input type="text" name="student[lastname]">' +
                '<input type="text" name="student[email]"><input type="text" name="student[phone]"><input type="submit" value="Submit"></form>' +
                '<form method="post" action="/users/"><input type="text" name="search"><input type="submit" value="Submit"></form>' +
                '<table><tr><th><a href="?sort=ln">Lastname</a></th><th><a href="?sort=fn">Firstname</a></th><th>email</th></th><th>phone</th><th>edit</th><th>delete</th></tr>';
            for (let i in data) {
                result += "<tr><td>" + data[i].lastname + "</td><td>" + data[i].firstname + "</td><td>" + data[i].email + "</td><td>" + data[i].phone +
                    "</td><td><a href='/users/edit/" + data[i]._id + "'>Edit</a></td><td><a href='/users/delete/" + data[i]._id + "'>Delete</a></td></tr>";
            }
            result += '</table>';
            res.send(result);
        });
    })

    app.post('/users/create', function(request, response) {
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
        response.redirect('/users/');
    });


    app.get('/users/delete/:id', function(req, response) {
        db.collection("students").deleteOne({ _id: ObjectId(req.params.id) })
        response.redirect('/users/');
    })


    app.post('/users/', function(req, res) {
        sort = {};
        if (req.query.sort == "ln") {
            sort = { lastname: 1 }

        } else if (req.query.sort == "fn") {
            sort = { firstname: 1 }
        }

        db.collection("students").find({ $or: [{ email: req.body.search }, { firstname: req.body.search }, { phone: req.body.search }, { lastname: req.body.search }] }).sort(sort).toArray(function(err, data) {
            if (err) throw err;
            let result = '<form method="post" action="/users/create"><input type="text" name="student[firstname]"><input type="text" name="student[lastname]">' +
                '<input type="text" name="student[email]"><input type="text" name="student[phone]"><input type="submit" value="Submit"></form>' +
                '<form method="post" action="/users/"><input type="text" name="search"><input type="submit" value="Submit"></form>' +
                '<table><tr><th><a href="?sort=ln">Lastname</a></th><th><a href="?sort=fn">Firstname</a></th><th>email</th></th><th>phone</th><th>edit</th><th>delete</th></tr>';
            for (let i in data) {
                result += "<tr><td>" + data[i].lastname + "</td><td>" + data[i].firstname + "</td><td>" + data[i].email + "</td><td>" + data[i].phone +
                    "</td><td><a href='/users/edit/" + data[i]._id + "'>Edit</a></td><td><a href='/users/delete/" + data[i]._id + "'>Delete</a></td></tr>";
            }
            result += '</table>';
            res.send(result);
        });
    })
});

app.listen(4242);