const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var sha1 = require('sha1');
var cors = require('cors');
app.use(cors());

app.listen(port, () => console.log(`Listening on port ${port}`));

MongoClient.connect('mongodb://localhost:27017/mern-pool', { useUnifiedTopology: true }, function(err, client) {
    if (err) { console.log("Connection failed.") } else { console.log("Connection Successfull") };
    var db = client.db('mern-pool');

    app.post('/register', function(req, res) {
        db.collection('membres').createIndex({ "login": 1 }, { unique: true });
        if (req.body.password == req.body.passwordconf) {
            db.collection('membres').insertOne({
                login: req.body.login,
                email: req.body.email,
                password: sha1(req.body.password),
                type: false
            }, function(err, inserted) {
                if (err) {
                    this.error = 'Inscription impossible, veuillez remplir correctement les champs';
                    res.send(false);
                } else {
                    this.error = 'Inscription reussite';
                    res.send(true);
                }
            });
        } else {
            this.error = 'Inscription impossible: mots de passe ne correspondent pas';
            res.send(false);
        }
    });

    app.post('/login', function(req, res) {
        db.collection("membres").find({ $and: [{ email: req.body.email }, { password: sha1(req.body.password) }] }).toArray(function(err, data) {
            if (err) throw err;
            if (data[0]) {
                res.send({ good: true, data: { id: data[0]['_id'], type: data[0]['type'], login: data[0]['login'] } });
            } else {
                this.error = 'Login and password doesnt match';
                res.send(false);
            }
        });
    });



    app.get('/express_backend', (req, res) => {
        db.collection("produits").find({}).toArray(function(err, results) {
            res.send({ produits: results });
        });
    });
});