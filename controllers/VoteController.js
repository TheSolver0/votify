const Vote = require('../models/Vote');
const User = require('../models/User');

exports.getVotes = async () => {
  try {
    const votes = await Vote.find({})
      .sort({ createdAt: -1 })
      .populate('author')
      .populate('candidats') ;
    return votes;
  } catch (err) {
    console.error('Erreur dans getVotes:', err);
    return []; // Retourne un tableau vide en cas d’erreur
  }
};


exports.getVoteDetails = (req, res) => {
    const id = req.params.id;
    
    Vote.findById(id)
        .populate('candidats')
        .populate('author')
        .then(vote => {
            const totalVotes = vote.candidats.reduce((sum, candidat) => {
      return sum + (candidat.nbvote || 0);
    }, 0);

            res.render('vote-details', { vote: vote , totalVotes: totalVotes });
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


exports.updateVote = async (req, res) => {
  if (!req.body) {
    console.log('Erreur : corps de requête vide');
    return res.sendStatus(400); // 400 pour bad request
  }

  try {
    const id = req.params.id;
    const image = req.file ? req.file.filename : undefined;
    const { title, description } = req.body;

    const updateData = {
      title,
      description
    };

    if (image) {
      updateData.image = image;
    }

    const updatedVote = await Vote.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedVote) {
      return res.status(404).json({ message: "Vote non trouvé" });
    }

    console.log('Vote mis à jour :', updatedVote);
    return res.status(200).json({ message: "Mise à jour réussie", vote: updatedVote });
  } catch (err) {
    console.error('Erreur de mise à jour :', err);
    return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
  }
};
exports.deleteVote = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    console.error('ID manquant dans les paramètres');
    return res.status(400).json({ error: 'ID requis pour la suppression' });
  }

  try {
    const deletedVote = await Vote.findByIdAndDelete(id);

    if (!deletedVote) {
      return res.status(404).json({ error: 'Vote non trouvé' });
    }

    console.log('Suppression réussie');
    return res.status(200).json({ message: 'Suppression réussie' });
  } catch (err) {
    console.error('Erreur lors de la suppression :', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
// function parseJwt() {
//     var tokenFromStorage = localStorage.getItem('token');
//     if (tokenFromStorage) {
//         var base64encoded = tokenFromStorage.split('.')[1];
//         return JSON.parse(window.atob(base64encoded));
//     }
// }
