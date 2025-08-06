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
exports.updateCandidat = (req, res) => {
    if (!req.body) {
        console.log('Erreur');
        return res.sendStatus(500);
    }
    else {
        console.log(`candidatName : ${req.body.name}  -  candidatDescription: ${req.body.description}`);
        const id = req.params.id;
        Candidat.findByIdAndUpdate(id, { $set: { name: req.body.name, description: req.body.description } }, { new: true })
            .then(candidat => {
                console.log(candidat);
                // res.json(candidat);
                // res.redirect('/movies')
            })
            .catch(err => {
                console.log(err);
                res.send('Erreur de mise à jour ');
            });
            return res.status(201).json({ message: "suppression successfully" });
    }
};
exports.deleteCandidat = (req, res) => {
    if (!req.params) {
        console.log('Erreur');
        return res.sendStatus(500);
    }
    else {
        const id = req.params.id;
        Candidat.findByIdAndDelete(id)
            .then(() => console.log("suppression successfully"))
            .catch(err => console.log(err));
        return res.status(201).json({ message: "suppression successfully" });
        
    }
};

// function parseJwt() {
//     var tokenFromStorage = localStorage.getItem('token');
//     if (tokenFromStorage) {
//         var base64encoded = tokenFromStorage.split('.')[1];
//         return JSON.parse(window.atob(base64encoded));
//     }
// }
