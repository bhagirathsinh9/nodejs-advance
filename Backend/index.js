// index.js
const http = require("http");
const { app } = require("./app");
const { Server } = require("socket.io");

const PORT = 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// In-memory blogs and comments
const blogs = []; 
const comments = {}; 

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("load_blogs", blogs);

  socket.on("new_blog", (blog) => {
    blogs.push(blog);
    io.emit("receive_blog", blog);
  });

  // Join blog room for comments
  socket.on("join_blog", (blogId) => {
    socket.join(blogId);
    socket.emit("load_comments", comments[blogId] || []);
  });

  // New comment
  socket.on("new_comment", ({ blogId, comment }) => {
    if (!comments[blogId]) comments[blogId] = [];
    comments[blogId].push(comment);
    io.to(blogId).emit("receive_comment", comment);
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
