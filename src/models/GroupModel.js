// src/models/Message.js
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },

  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Group", groupSchema);
