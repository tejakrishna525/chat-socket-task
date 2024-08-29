// src/models/Message.js
const mongoose = require("mongoose");

const GroupChatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: false,
    },
    content: { type: String, required: true },
  },
  { timestamp: true }
);

module.exports = mongoose.model("GroupChat", GroupChatSchema);
