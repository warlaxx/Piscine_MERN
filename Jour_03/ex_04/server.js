const express = require('express')
const app = express()
fs = require('fs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var ObjectId = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var sha1 = require('sha1');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false }
}));

MongoClient.connect('mongodb://localhost:27017/mern-pool', { useUnifiedTopology: true }, function(err, client) {
    if (err) { console.log("Connection failed.") } else { console.log("Connection Successfull") };
    var db = client.db('mern-pool');

    app.set('trust proxy', 1) // trust first proxy

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
                password: sha1(req.body.register.password),
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
        db.collection("membres").find({ $and: [{ email: req.body.login.email }, { password: sha1(req.body.login.password) }] }).toArray(function(err, data) {
            if (err) throw err;
            if (data[0]) {
                req.session.user = data[0]["type"];
                req.session.save();
                console.log(req.session);

                res.status(200).redirect("/boutique");
            } else {
                this.error = 'Login and password doesnt match';
                res.status(400).render('login');
            }
        });
    });

    app.get('/boutique', function(req, res) {
        if (req.session.user != undefined) {
            db.collection("produits").find({}).toArray(function(err, results) {
                res.render('boutique', { results: results });
            });
        } else {
            res.send("vous n'etes pas co")
        }
    });

    app.get('/boutique/:id', function(req, res) {
        if (req.session.user != undefined) {
            db.collection("produits").find({ _id: ObjectId(req.params.id) }).toArray(function(err, results) {
                res.render('produit', { results: results });
            });
        } else {
            res.send("vous n'etes pas co")
        }
    });

    app.get('/admin/add', function(req, res) {
        if (req.session.user == true) {
            res.render('ajoutproduit');
        } else {
            res.send("vous n'avez pas acces")
        }
    });

    app.post('/admin/add', function(req, res) {
        if (req.session.user == true) {
            db.collection('produits').createIndex({ "nom": 1 }, { unique: true });
            db.collection('produits').insertOne({
                nom: req.body.add.nom,
                prix: req.body.add.prix,
                description: req.body.add.description,
            }, function(err, inserted) {
                if (err) {
                    this.error = 'Entrée produit impossible, veuillez remplir correctement les champs';
                    res.status(400).redirect('/boutique');
                } else {
                    this.error = 'Entrée produit reussite';
                    res.status(200).redirect('/boutique');
                }
            });
        } else {
            res.send("vous n'avez pas acces")
        }
    });
});

app.listen(4242);