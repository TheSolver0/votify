const Vote = require('../models/Vote');
const User = require('../models/User');

exports.getVotes = (req, res) => {

    // var payload = parseJwt();

    Vote.find({})
        .populate('author')
        .sort({ _id: -1 })
        .then(votes => {
            
        //    return res.render('votes', { votes });
        })
        .catch(err => {
            console.error(err);
        });

};

exports.getVoteDetails = (req, res) => {
    const id = req.params.id;
    Vote.findById(id)
        .then(vote => {
            res.render('vote-details', { vote: vote });
        })
        .catch(err => {
            console.error(err);
        })
};

exports.getVoteAdd = (req, res) => {
    res.render('add-vote');
};

exports.getVoteSearch = (req, res) => {
    const title = req.params.term;
    Vote.find({ title: { $regex: `.*${title}.*`, $options: "i" } })
        .then(vote => {
            frenchVotes = vote;
            console.log(frenchVotes);
            //  res.send(movie);
            res.render('votes-search', { frenchVotes });
        })
        .catch(err => {
            console.error(err);
            alert('err');
        })
};

exports.postVote = (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);
    }

    const formData = req.body;
    console.log('formData: ', formData);

    User.findById(req.body.user_id)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            const image = req.file ? req.file.filename : undefined;
            const { title, description } = req.body;

            const myVote = new Vote({
                title,
                description,
                author: user._id,
                image
            });

            return myVote.save()
                .then(savedVote => {
                    user.votes.push(savedVote._id);
                    return user.save().then(() => {
                        return res.status(201).json({ message: "Vote ajouté avec succès !" });
                    });
                });
        })
        .catch(err => {
            console.error("Erreur :", err);
            return res.status(500).json({ message: "Erreur lors de l'ajout du vote" });
        });
};


exports.updateVote = (req, res) => {
    if (!req.body) {
        console.log('Erreur');
        return res.sendStatus(500);
    }
    else {
        console.log(`voteTitle : ${req.body.title}  `);
        const id = req.params.id;
        Vote.findByIdAndUpdate(id, { $set: { title: req.body.title } }, { new: true })
            .then(vote => {
                console.log(vote);
                // res.json(vote);
                // res.redirect('/movies')
            })
            .catch(err => {
                console.log(err);
                res.send('Erreur de mise à jour ');
            });
        return res.status(201).json({ message: "suppression successfully" });
    }
};
exports.deleteVote = (req, res) => {
    if (!req.params) {
        console.log('Erreur');
        return res.sendStatus(500);
    }
    else {
        const id = req.params.id;
        Vote.findByIdAndDelete(id)
            .then(console.log("suppression successfully"))
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
