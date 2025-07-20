const Candidat = require('../models/Candidat');
const Vote = require('../models/Vote');

exports.getCandidats = (req, res) => {

    // var payload = parseJwt();

    Candidat.find({})
        .populate('author')
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

exports.postCandidat = (req, res) => {
    if (!req.body)
        return res.sendStatus(500);

    const formData = req.body;
    console.log('formData: ', formData);
    // console.log(req.body.user_id);

    Vote.findById(req.body.vote_id)
        .then(vote => {
            if (!vote) {
                return console.log('Vote non trouvé');
            }
            // console.log('user :', user._id);
            const image = req.file ? req.file.filename : undefined;

            const name = req.body.name;
            const description = req.body.description;
            const myCandidat = new Candidat({ name: name, description: description, vote: vote._id, image });
            myCandidat.save()
                .then(savedCandidat => {
                    console.log(savedCandidat);
                    vote.candidats.push(savedCandidat._id);
                    vote.save();
                })
                .catch(err => {
                    console.log(err);
                });

           
        })
        .catch(err => {
            console.log("Erreur : ", err);
          });

    return res.status(201).json({ message: "Film ajouté avec succès !" });
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
