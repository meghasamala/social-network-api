const { User } = require('../models');

const userController = {

  getUsers(req, res) {
    User.find({})
      .populate({ 
        path: 'thoughts',
        select: '-__v' 
      })
      .populate({ 
        path: 'friends',
        select: '-__v' 
      })
      .select('-__v')
      .sort({ _id: -1 }) 
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
    .populate({
      path: 'thoughts',
      select: '-__v'
    })
    .populate({
      path: 'friends',
      select: '-__v'
    })
    .select('-__v')
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  
  createUser({ body }, res) { 
    User.create(body) 
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

 
  updateUser({ params, body }, res) {
    User.findOneAndUpdate(
      { _id: params.userId }, 
      body, 
      { new: true, runValidators: true }
    ) 
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id!'} );
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
  },

  
  deleteUser({ params }, res) {
    User.findOneAndRemove({ _id: params.userId }, function(err, user) {
      if (err) {
        res.status(404).json({ message: 'No user found with this id!'} );
        return;
      }
      res.json(user);
      user.remove();
    })
  },

  
  addFriend({ params }, res) {     
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } }, 
      { new: true, runValidators: true }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No friend found with this id!'});
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.json(err));
  },

  
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } }
    )
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No friend found with this id!' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
  }
};

module.exports = userController;