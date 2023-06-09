require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connection = require('./connection/db');
const userRouters =require('./routes/user.routes');
const authRoutes = require("./routes/auth.routes");
const songRouters = require('./routes/song.routes');
const playlistRouters = require('./routes/playlist.routes');
const searchRouters = require('./routes/search.routes');

const cors = require('cors');
const app = express();
connection();
app.use(cors());
app.use(express.json());

app.use('/api/users',userRouters);
app.use('/api/login',authRoutes);
app.use("/api/songs",songRouters);
app.use("/api/playlists",playlistRouters);
app.use("/api/search",searchRouters);




const port = process.env.PROT || 8080;
app.listen(port,console.log("Listen on port" + port));