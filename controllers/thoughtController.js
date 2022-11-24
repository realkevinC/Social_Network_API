const { User, Thought } = require("../models");

module.exports = {
    // Get all thought
    getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
    // get single thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId})
        .select('-__v')
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));  
    },
    // create a new thought
    createThought(req, res){
        Thought.create(req.body)
        .then((thought) => {
            Thought.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thought: _id } },
                { new: true, runValidators: true })
            res.json(thought)
        })
        .catch((err) => res.status(500).json(err));
    },
    // Update a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate({_id: req.params.thoughtId},
            req.body,
            { new: true, runValidators: true })
            .then((thought)=> 
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err)); 
    },
    // Delete a thought
    deleteThought(req, res){
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought)=> 
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought))
        .catch((err) => res.status(500).json(err)); 
    },
    // Add reaction
    addReaction(req, res){
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true, runValidators: true })
        .then((thought)=> 
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    // delete reaction
    removeReaction(req, res){
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { _id: req.body.reactionId }}},
            {  new: true, runValidators: true})
        .then((thought)=> 
        !thought
        ? res.status(404).json({ message: 'No thought with that ID' })
        : res.json(thought))
        .catch((err) => res.status(500).json(err));
    }
}