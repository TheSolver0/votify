const User = require('../models/User');
const path = require('path');

exports.getUsers = (req, res) => {
    // liste des user
};
exports.getProfil = (req, res) => {
    res.render('dashboard');
};
exports.getUserDetails = (req, res) => {
    // details d'un user
};
exports.getUserRegister = (req, res) => {
    res.render('register');
};
exports.postUser = async (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);  // Mauvaise requête
    }

    const { name, organisation, tel, email, password, avatar } = req.body;

    // const storage = multer.diskStorage({
    //     destination: function (req, avatar, cb) {
    //       cb(null, 'uploads/'); // Dossier où les fichiers seront enregistrés
    //     },
    //     filename: function (req, avatar, cb) {
    //       const ext = path.extname(file.originalname); // Extraction de l'extension du fichier
    //       const fileName = avatar.fieldname + '-' + Date.now() + ext; // Génération d'un nom unique
    //       cb(null, fileName);
    //     }
    //   });

    // Vérification des champs obligatoires
    if (!name || !email || !password || !organisation) {
        return res.status(400).json({ message: "Veuillez fournir un nom, un email, un mot de passe et une organisation." });
    }

    try {
        // Vérifier si un utilisateur avec cet email existe déjà
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "L'email est déjà utilisé." });
        }

        // Créer un nouvel utilisateur
        console.log(req.file);
        const avatar = req.file ? req.file.filename : undefined;

        const myUser = new User({ name, organisation, tel, email, password, avatar });

        // Sauvegarder l'utilisateur
        await myUser.save();

        
        // Réponse après création réussie
        return res.status(200).json({ message: "Utilisateur créé avec succès !" });
    } catch (err) {
        // Gérer les erreurs du serveur ou du hachage
        console.error("Erreur lors de la création de l'utilisateur : ", err);
        return res.status(500).json({ message: "Erreur de serveur lors de la création de l'utilisateur." });
    }
};
