const express = require('express');
const http = require('http'); // Import http module
const socketIo = require('socket.io'); // Import socket.io module
const loginRoutes = require("./Routes/LoginRoutes.js");
const signUpRoutes = require("./Routes/SignUpRoutes.js");
const eventRoutes = require("./Routes/EventRoutes.js");
const parentalControlsRoutes = require("./Routes/ParentalControl.js");
const userRoutes = require('./Routes/UserRoutes.js');
const adminControlRoutes = require('./Routes/AdminControls.js');
const emailRoutes = require("./Routes/EmailRoutes.js");
const staffRoutes = require("./Routes/StaffRoutes.js")
const newsletterRoutes = require('./Routes/NewsLetter.js')
const cors = require('cors');
require('dotenv').config();



const app = express();
app.use(cors());
// Attach socket.io to the HTTP server

app.use(express.json());
app.use("/login", loginRoutes);
app.use("/signUp", signUpRoutes);
app.use("/events", eventRoutes);
app.use("/parentalControls", parentalControlsRoutes);
app.use("/users", userRoutes);
app.use("/adminControls", adminControlRoutes);
app.use("/email", emailRoutes);
app.use("/staff", staffRoutes);
app.use('/newsletters', newsletterRoutes)


const server = http.createServer(app); // Create a HTTP server instance
const io = socketIo(server);
//only used for deployment 
//app.use(express.static('public'));

io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
        socket.join(data);
        io.to(data).emit("user_joined", { user: socket.id, room: data });
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
