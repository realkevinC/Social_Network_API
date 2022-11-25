const { User, Thought } = require("../models");

module.exports = {
    // Get all users
    getUsers(req, res) {
      User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err));
    },
    // Get a single user
    getSingleUser(req, res) {
      User.findOne({ _id: req.params.id })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
        .select('-__v')
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // create a new user
    createUser(req, res) {
      User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },
    // Update a user
    updateUser(req, res) {
        User.findOneAndUpdate({_id: req.params.id},
            { $set:
            {
            username: req.body.username,
            email: req.body.email
            }},
            { new: true, runValidators: true })
        .then((user)=> 
        !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Delete a user
    deleteUser(req, res) {
      User.findOneAndDelete({ _id: req.params.id })
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: 'User deleted!' }))
        .catch((err) => res.status(500).json(err));
    },
   // add friend
   addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends:{ _id: req.params.friendId }}},
      { new: true, runValidators: true })
      .then((user) => 
        !user 
          ? res.status(404).json({ message: "No user with this id" })
          : res.json(user)
          )
      .catch((err) => res.status(500).json(err));
  },

  // delete friend
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends:{ $in:[ req.params.friendId ]}}},
      { new: true, runValidators: true }
    )
    .then((user) => 
    !user 
      ? res.status(404).json({ message: "No user with this id" })
      : res.json(user)
      )
  .catch((err) => res.status(500).json(err));
  }
};

