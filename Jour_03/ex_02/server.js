const express = require('express')
const app = express()
fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

MongoClient.connect('mongodb://localhost:27017/mern-pool', { useUnifiedTopology: true }, function(err, client) {
    if (err) { console.log("Connection failed.") } else { console.log("Connection Successfull") };
    var db = client.db('mern-pool');

    db.createCollection("membres", {
        validator: {
            $and: [
                { id: { $type: "int" } },
                { login: { $type: "string", $regex: /[\w]{5,20}/ } },
                { email: { $type: "string", $regex: /[\w-]+@([\w-]+\.)+[\w-]+/ } },
                { password: { $type: "string" } },
                { type: { $type: "bool" } }
            ]
        }
    })

    app.get('/register', function(req, res) {
        this.error = ''
        res.render('register');
    });

    app.post('/register', function(req, res) {
        db.collection('membres').createIndex({ "login": 1 }, { unique: true });
        if (req.body.register.password == req.body.register.passwordconfirm) {
            db.collection('membres').insertOne({
                login: req.body.register.login,
                email: req.body.register.email,
                password: req.body.register.password,
                type: false
            }, function(err, inserted) {
                if (err) {
                    this.error = 'Inscription impossible, veuillez remplir correctement les champs';
                    res.status(400).render('register');
                } else {
                    this.error = 'Inscription reussite';
                    res.status(200).render('register');
                }
            });
        } else {
            this.error = 'Inscription impossible: mots de passe ne correspondent pas';
            res.status(400).render('register');
        }
    });


    app.get('/login', function(req, res) {
        this.error = ''
        res.render('login');
    });

    app.post('/login', function(req, res) {
        db.collection("membres").find({ $and: [{ email: req.body.login.email }, { password: req.body.login.password }] }).toArray(function(err, data) {
            if (err) throw err;
            if (data[0]) {
                res.status(200).send("Welcome " + data[0]["login"] + " !");
            } else {
                this.error = 'Login and password doesnt match';
                res.status(400).render('login');
            }
        });


        // if (user_exist) {
        //     console.log("found");
        // } else {
        //     console.log("not found");
        // }
    });

});


app.listen(4242);