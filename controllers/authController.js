const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = 'Akqdosfkdkxlfd7f1d51f85dd1515205ssJNIKq51515602scnbhbfsjkdln';

const fakeUser = {email: 'test@test.com', password: 'test123'};


exports.login = (req,res) => {
    res.render('login', { title: 'Connexion' });
};

exports.postLogin = async (req,res) => {

    const { email, password } = req.body;
    console.log(req.body);
    console.log(email, password);

    try {
        console.log(req.body);
        const user = await User.findOne({ email: email });
        console.log(user);

        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        // Comparer les mots de passe
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        var myToken = jwt.sign({iss: 'D:\\Travail\\site vote', user: user, scope: 'admin'} , SECRET);
        // localStorage.setItem('token', myToken);

        res.cookie('token', myToken, {
            httpOnly: true,  // Le cookie ne peut pas être accédé via JavaScript
            // secure: process.env.NODE_ENV === 'production', // Utilisez true en production pour HTTPS
            maxAge: 3600000 // 1 heure
        });


        res.status(200).json({ message: "Connexion réussie", myToken: myToken, user: user });

    } catch (err) {
        res.status(500).json({ message: "Erreur de serveur" });
    }

};

exports.getMembersOnly = (req, res) => {

    console.log('req.user',req.auth.user);
    res.send(req.auth.user);
};