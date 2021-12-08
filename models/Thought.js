const { Schema, model, Types } = require('mongoose');

const ReactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId()
  },
  reactionBody: {
    type: String, 
    required: true,
    maxLength: 280
  },
  username: {
    type: String, 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal 
  },
  },
  {
    toJSON: {
      getters: true
    },
    id: false
});

const ThoughtSchema = new Schema({
    thoughtText: {
      type: String, 
      required: true,
      maxLength: 280,
      minlength: 1
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal 
    },
    username: {
      type: String,
      required: true
    },
    reactions: [ReactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true
    },
    id: false
});


ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;