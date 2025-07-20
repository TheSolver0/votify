const Vote = require('../models/Vote');
const User = require('../models/User');

exports.getVotes = (req, res) => {

    // var payload = parseJwt();

    Vote.find({})
        .populate('author')
        .sort({ _id: -1 })
        .then(votes => {
            frenchVotes = votes;
            res.render('votes', { frenchVotes });
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
    if (!req.body)
        return res.sendStatus(500);

    const formData = req.body;
    console.log('formData: ', formData);
    // console.log(req.body.user_id);

    User.findById(req.body.user_id)
        .then(user => {
            if (!user) {
                return console.log('Utilisateur non trouvé');
            }
            // console.log('user :', user._id);
            const image = req.file ? req.file.filename : undefined;

            const title = req.body.movietitle;
            const year = req.body.movieyear;
            const myVote = new Vote({ movietitle: title, movieyear: year, author: user._id, image });
            myVote.save()
                .then(savedVote => {
                    console.log(savedVote);
                    user.votes.push(savedVote._id);
                    user.save();
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

exports.updateVote = (req, res) => {
    if (!req.body) {
        console.log('Erreur');
        return res.sendStatus(500);
    }
    else {
        console.log(`voteTitle : ${req.body.title}  `);
        const id = req.params.id;
        Vote.findByIdAndUpdate(id, { $set: { title: req.body.title} }, { new: true })
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
