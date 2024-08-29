// src/app.js
const express = require("express");
const { isLoggedIn } = require("./src/middlewares/auth.js");
const jwt = require("jsonwebtoken");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/userRoutes");
const User = require("./src/models/User.js")
const Chat = require("./src/models/Message.js")
const connectDb = require("./src/db/index.js");

const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "src", "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
const server = http.createServer(app);
const io = socketIo(server);
 let usp = io.of('/user-namespace');
 
// Middleware to parse JSON and URL-encoded bodies
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // This line is added to parse URL-encoded form data

connectDb();

// Route to render the registration form
app.get("/register", (req, res) => {
  const message = req.query.message || "";
  res.render("register", { message });
});

// Route to render the login form
app.get("/login", (req, res) => {
  const message = req.query.message || "";
  res.render("login", { message });
});

app.post(
  "/api/auth/register",
  require("./src/controllers/authController").register
);

app.post("/api/auth/login", require("./src/controllers/authController").login);
app.use("/api/auth", authRoutes);
app.post("/save-chat",require("./src/controllers/userController.js").saveChat)
app.use("/dashboard", dashboardRoutes);


// Middleware for authenticating socket connections
usp.use((socket, next) => {
  const token = socket.handshake.auth.token; // Extract the token from socket handshake
  if (token) {
    jwt.verify(token, "secretkey", (err, decoded) => {
      // Verify the token using your secret key
      if (err) return next(new Error("Authentication error")); // If verification fails, send an error
      socket.userId = decoded.userId; // Save the decoded userId to the socket object
      next(); // If verification succeeds, proceed to the next middleware
    });
  } else {
    next(new Error("Authentication error")); // If no token is provided, send an error
  }
});

usp.on("connection",async (socket) => {
  console.log("New client connected");
  console.log(socket.userId)    
await User.findByIdAndUpdate({_id : socket.userId},{$set : {isOnline: true}})

//user brodcast online status
socket.broadcast.emit("getOnlineUser",{user_id : socket.userId})

  socket.on("message", (message) => {
    console.log("message received", message);
    io.emit("message", message);
  });

  socket.on("disconnect",async () => {
    console.log("Client disconnected");

    await User.findByIdAndUpdate({_id : socket.userId},{$set : {isOnline: false}})
    //user brodcast offline status
socket.broadcast.emit("getOfflineUser",{user_id : socket.userId})
  });
//chat implementation
socket.on('newChat',function(data){
    console.log("data",data)
    socket.broadcast.emit('loadnewChat',data)
})

// load history old chats
socket.on('existsChat',async function(data){
    console.log("existschat",data)
 let chats =  await  Chat.find({$or:[
        {senderId: data.sender_id,receiverId:data.receiver_id},
        {senderId: data.receiver_id,receiverId:data.sender_id}
    ]})
    console.log("chats",chats)
    socket.emit('loadchats',{chats: chats})
    
})

// new group chats adde
socket.on('newgroupchat',function(data){
  socket.broadcast.emit('loadNewGroupChat',data); // broadcast group chat object
  
})




});





const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
