const Candidat = require('../models/Candidat');
const Vote = require('../models/Vote');

exports.getCandidats = (req, res) => {

    // var payload = parseJwt();

    Candidat.find({})
        // .populate('author')
        .sort({ _id: -1 })
        .then(candidats => {
            res.render('candidats', { candidats });
        })
        .catch(err => {
            console.error(err);
        });

};

exports.getCandidatDetails = (req, res) => {
    const id = req.params.id;
    Candidat.findById(id)
        .populate('vote')
        .populate('vote.author')
        .then(candidat => {
            res.render('candidat-details', { candidat: candidat });
        })
        .catch(err => {
            console.error(err);
        })
};

exports.getCandidatAdd = (req, res) => {
    res.render('add-movie');
};

exports.getCandidatSearch = (req, res) => {
    const title = req.params.term;
    Candidat.find({ name: { $regex: `.*${title}.*`, $options: "i" } })
        .then(candidat => {
            frenchCandidats = candidat;
            console.log(frenchCandidats);
            //  res.send(movie);
            res.render('candidats-search', { frenchCandidats });
        })
        .catch(err => {
            console.error(err);
            alert('err');
        })
};

exports.postCandidat = async (req, res) => {
    if (!req.body) return res.sendStatus(400); // 400 pour bad request

    try {
        const { vote_id, name, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const vote = await Vote.findById(vote_id);
        if (!vote) {
            console.log('Vote non trouvé');
            return res.status(404).json({ message: "Vote non trouvé." });
        }

        const candidat = new Candidat({ name, description, vote: vote._id, image });
        const savedCandidat = await candidat.save();

        vote.candidats.push(savedCandidat._id);
        await vote.save();

        res.status(201).json({ message: "Candidat ajouté avec succès !" });
    } catch (err) {
        console.error("Erreur : ", err);
        res.status(500).json({ message: "Erreur serveur lors de l'ajout du candidat." });
    }
};
exports.updateCandidat = async (req, res) => {
    if (!req.body) {
        console.log('Erreur : corps de requête vide');
        return res.sendStatus(400); // 400 pour bad request
    }

    try {
        const id = req.params.id;
        const image = req.file ? req.file.filename : undefined;
        const { name, description } = req.body;

        const updateData = {
            name,
            description
        };

        if (image) {
            updateData.image = image;
        }

        const updatedCandidat = await Candidat.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCandidat) {
            return res.status(404).json({ message: "Candidat non trouvé" });
        }

        console.log('Candidat mis à jour :', updatedCandidat);
        return res.status(200).json({ message: "Mise à jour réussie", candidat: updatedCandidat });
    } catch (err) {
        console.error('Erreur de mise à jour :', err);
        return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
    }
};
exports.deleteCandidat = async (req, res) => {
    const { id } = req.params;
    console.log('ID du candidat à supprimer :', id);
    console.log('Requête methode :', req.method);

    if (!id) {
        console.error('ID manquant dans les paramètres');
        return res.status(400).json({ error: 'ID requis pour la suppression' });
    }

    try {
        const deletedCandidat = await Candidat.findByIdAndDelete(id);

        if (!deletedCandidat) {
            return res.status(404).json({ error: 'Candidat non trouvé' });
        }

        console.log('Suppression réussie');
        return res.status(200).json({ message: 'Suppression réussie' });
    } catch (err) {
        console.error('Erreur lors de la suppression :', err);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
};
exports.voteCandidat = async (req, res) => {
        const { id } = req.params;

        try {
            const candidat = await Candidat.findById(id);
            if (!candidat) return res.status(404).json({ error: 'Candidat introuvable' });

            candidat.nbvote += 1;
            await candidat.save();

            res.status(200).json({ message: 'Vote enregistré', nbvote: candidat.nbvote });
        } catch (err) {
            console.error('Erreur vote:', err);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    };
// function parseJwt() {
//     var tokenFromStorage = localStorage.getItem('token');
//     if (tokenFromStorage) {
//         var base64encoded = tokenFromStorage.split('.')[1];
//         return JSON.parse(window.atob(base64encoded));
//     }
// }
