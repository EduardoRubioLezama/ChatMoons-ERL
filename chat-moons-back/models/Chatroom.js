const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required!",
  },
  participantA: {
    type: mongoose.Schema.Types.ObjectId,
    required: "participantB is required!",
    ref: "User",
  },
  participantB: {
    type: mongoose.Schema.Types.ObjectId,
    required: "participantB is required!",
    ref: "User",
  }
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
