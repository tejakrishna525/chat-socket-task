const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Message");
const Group = require("../models/GroupModel");
const Member = require("../models/MemberModel")
const GroupChat = require("../models/GroupChatModel")

exports.groupChatSave = async(req,res)=>{
  try {
    const token = req.cookies.token; // Extract the token from the cookie

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, "secretkey", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // find users to display in the dashboard

      const users = await User.find({ _id: { $nin: [decoded.userId] } });
      console.log("users", users);

      // Find the user by ID from the token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    let chat =   new GroupChat({
        senderId: req.body.senderId,
        groupId: req.body.groupId,
        content: req.body.content
      })

     let newchat =  await chat.save();
      res.send({sucess : true,chat : newchat})
      
      
    });
  } catch (error) {
    console.error("Error saving group chat ", error);
    res.status(500).json({ message: "Error saving group chat " });
  }

}

exports.groupChats = async(req,res)=>{


  try {
    const token = req.cookies.token; // Extract the token from the cookie

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, "secretkey", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // find users to display in the dashboard

      const users = await User.find({ _id: { $nin: [decoded.userId] } });
      console.log("users", users);

      // Find the user by ID from the token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
        const myGroups = await Group.find({creatorId: user._id});
        const joinedGroups = await Member.find({userId: user._id}).populate('groupId');
      // Return the user's name
        res.status(200).json({mygroups: myGroups,joinedGroups:joinedGroups})
    });
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ message: "Error fetching user information" });
  }

}



exports.dashboard = async (req, res) => {
  try {
    const token = req.cookies.token; // Extract the token from the cookie

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, "secretkey", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // find users to display in the dashboard

      const users = await User.find({ _id: { $nin: [decoded.userId] } });
      console.log("users", users);

      // Find the user by ID from the token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Return the user's name
      res.render("dashboard", { user: user, users: users, token: token });
    });
  } catch (error) {
    console.error("Error fetching user information:", error);
    res.status(500).json({ message: "Error fetching user information" });
  }
};

exports.saveChat = async (req, res) => {
  console.log("save chat called", req.body);

  try {
    let chat = new Chat({
      senderId: req.body.sender_id.toString(),
      receiverId: req.body.receiver_id.toString(),
      content: req.body.message,
    });
    console.log("chat dwejh", chat);
    let newChat = await chat.save();
    res
      .status(200)
      .send({ success: true, msg: "new chat inserted", data: newChat });
  } catch (error) {
    console.log("error", error);
  }
};

exports.loadGroups = async (req, res) => {
  try {
    const token = req.cookies.token; // Extract the token from the cookie

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, "secretkey", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // find users to display in the dashboard

      const users = await User.find({ _id: { $nin: [decoded.userId] } });
      console.log("users", users);

      // Find the user by ID from the token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      let members = await User.find({ _id: { $nin: [user._id] } });
      res.status(200).json({ success: true, data: members });
    });
  } catch (error) {}
};
exports.getMembers = async (req, res) => {
  try {
    const token = req.cookies.token; // Extract the token from the cookie

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, "secretkey", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // find users to display in the dashboard

      const users = await User.find({ _id: { $nin: [decoded.userId] } });
      console.log("users", users);

      // Find the user by ID from the token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const groups = await Group.find({ creatorId: user._id });
      res
        .status(200)
        .json({ success: true, msg: "groups loaded", data: groups });
    });
  } catch (error) {
    console.log("error", error);
  }
};

exports.createGroups = async (req, res) => {
  try {
    const token = req.cookies.token; // Extract the token from the cookie

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, "secretkey", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // find users to display in the dashboard

      const users = await User.find({ _id: { $nin: [decoded.userId] } });
      console.log("users", users);

      // Find the user by ID from the token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const group = new Group({
        creatorId: user._id,
        name: user.name,
        limit: req.body.limit,
      });
      await group.save();
      const groups = await Group.find({ creatorId: user._id });
      res
        .status(200)
        .send({ success: true, msg: "new group created", data: groups });
    });
  } catch (error) {
    console.log("error", error);
  }
};

exports.addMembers = async (req, res) => {
  try {
    const token = req.cookies.token; // Extract the token from the cookie

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    jwt.verify(token, "secretkey", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // find users to display in the dashboard

      const users = await User.find({ _id: { $nin: [decoded.userId] } });
      console.log("users", users);

      // Find the user by ID from the token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!req.body.members) {
        res
          .status(200)
          .json({ success: false, msg: "Please select atleast one member" });
      } else if (req.body.members.length > parseInt(req.body.limit)) {
        res.status(200)
          .send({
            success: false,
            msg:
              "you can not  select more than " + "+req.body.limit+" + "members",
          });
      }
      else{
       await  Member.deleteMany({groupId: req.body.groupId})
        let data = []
        let members = req.body.members
        for(let i = 0 ; i<members.length; i++){
          data.push({
            groupId : req.body.groupId,
            userId : members[i]
          })
        }
        await members.insertMany(data)
        res.status(200).send({success:true,msg: "members added successfully"})

      }
    });
  } catch (error) {
    console.log(error);
  }
};
