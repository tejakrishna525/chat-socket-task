// src/models/Message.js
const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Member", MemberSchema);
