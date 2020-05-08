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

    app.get('/billet/:id', function(req, res) {
        console.log(req.body)
        db.collection('billets').aggregate([{
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "pour",
                    as: "comments"
                }
            },
            {
                $match: { _id: ObjectId(req.params.id) }
            }
        ]).toArray(function(err, results) {
            res.send({ billets: results });
        });
    });


    app.post('/billet/create', function(req, res) {
        db.collection('billets').insertOne({
            titre: req.body.titre,
            contenu: req.body.contenu,
            user: ObjectId(req.body.user),
            date: new Date(Date.now()).toISOString()
        }, function(err, inserted) {
            if (err) {
                res.send(false);
            } else {
                res.send(true);
            }
        });
    });

    app.post('/billet/delete/:id', function(req, response) {
        db.collection("billets").deleteOne({ _id: ObjectId(req.params.id) })
        response.send(true);
    })

    app.post('/billet/edit/:id', function(req, res) {
        db.collection('billets').updateOne({
            _id: ObjectId(req.params.id)
        }, {
            $set: {
                titre: req.body.titre,
                contenu: req.body.contenu
            }
        }, function(err, inserted) {
            if (err) {
                console.log(err);
                res.send(false);
            } else {
                console.log(req.body.contenu)
                res.send(true);
            }
        });
    })

    app.post('/commentaire/delete/:id', function(req, response) {
        db.collection("comments").deleteOne({ _id: ObjectId(req.params.id) })
        response.send(true);
    })

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

    app.get('/', function(req, res) {
        db.collection('billets').aggregate([{
            $group: { _id: null, uniqueValues: { $addToSet: "$user" } }
        }]).toArray(function(err, results) {
            res.send({ billets: results[0]["uniqueValues"] });

        });


    });

    app.get('/all/:login', function(req, res) {
        db.collection("membres").find({ login: req.params.login }).toArray(function(err, data) {
            db.collection("billets").find({ user: data[0]["_id"] }).toArray(function(err, results) {
                res.send({ billets: results });
            });
        });
    });


    app.get('/commentaire/:id', function(req, res) {
        db.collection('comments').aggregate([{
                $lookup: {
                    from: "billets",
                    localField: "pour",
                    foreignField: "_id",
                    as: "billet"
                }
            },
            {
                $match: { _id: ObjectId(req.params.id) }
            }
        ]).toArray(function(err, results) {
            res.send({ commentaire: results[0] });
        });
    });


});