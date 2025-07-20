const express = require('express')
const app = express()
const PORT = 3000;

const bodyParser = require('body-parser');
const multer = require('multer');
// const upload = multer({ dest: './public/data/uploads/' })
const path = require('path');
const jwt = require('jsonwebtoken');
const upload = multer();
const {faker} = require('@faker-js/faker');
faker.locale = "fr";

var { expressjwt: ejwt } = require("express-jwt");
const mongoose = require('mongoose');


const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const config = require('./config');

const SECRET = 'Akqdosfkdkxlfd7f1d51f85dd1515205ssJNIKq51515602scnbhbfsjkdln';
const AUTH = ejwt({secret: SECRET, algorithms: ["HS256"]});


mongoose.connect(`mongodb+srv://${config.DB.user}:${config.DB.password}@cluster0.ryuty.mongodb.net/votify?retryWrites=true&w=majority&appName=Cluster0`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: cannot connect  to my DB'));
db.once('open', () => {
    console.log('connected to the DB :)');
});

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/avatars/'); // Dossier où les avatars seront stockés
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase(); // Extension du fichier
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Suffixe unique pour éviter les collisions
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      }
  });
const avatarUpload =  multer({
    storage: avatarStorage,
    fileFilter: function (req, file, cb) {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
  
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Seules les images JPEG, JPG et PNG sont autorisées.'));
      }
    }
  });

const authenticateToken = (req, res, next) => {
    const token = req.headers.cookie.split('token=')[1];

    if (!token) {
        return res.render('login'); // Non authentifié
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Non autorisé
        }

        req.user = user; // Ajouter les informations de l'utilisateur à la requête
        res.locals.user = user.user;
        // console.log(req.user.user);
        next();
    });
};


app.use('/public', express.static('public'))


app.set('views', './views')
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
  res.render('index', { title: 'Home' })
})

app.get('/login', authController.login);


app.post('/login', upload.fields([]) , authController.postLogin);

app.get('/members-only', authController.getMembersOnly);

app.get('/users', userController.getUsers);

app.get('/users/register', userController.getUserRegister);

// app.post('/users/register', avatarUpload.single('avatar'), userController.postUser);
app.post('/users/register', avatarUpload.single('avatar'), userController.postUser);

app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true, 
        // secure: process.env.NODE_ENV === 'production', // Assurez-vous d'utiliser true en production avec HTTPS
        maxAge: 3600000 // 1 heure

    });
    res.status(200).json({ message: 'Déconnexion réussie' });
});

app.get('/dashboard', userController.getProfil);
// app.get('/dashboard', authenticateToken, userController.getProfil);


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
