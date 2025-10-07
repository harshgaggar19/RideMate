// server.js

import 'dotenv/config';
import express from 'express';
import connect from './database/conn.js';
import usersRouter from "./routes/userRoute.js";
import cors from 'cors';
import { getChat } from './fetch/getchat.js';
import './control/chat.js'; // Assuming this file has side effects but doesn't export anything to be used here
import { makeGroup } from './control/room.js';
import { createUser } from './controllers/userController.js';
import { groupsjoined } from './fetch/getrooms.js';

// Initialize express app
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Database Connection
connect().catch((err) => {
    console.error("Invalid database connection...!", err);
});

// API Routes
app.get("/", (req, res) => {
    res.send("Hello World! This is the root of the API.");
});

app.post("/signup", createUser);
app.use("/users", usersRouter);

app.post("/api/places", async (req, res) => {
    console.log(req.body);
    res.json({ message: "received" });
});

app.get("/api/getchat", getChat);     // To get chat in room
app.post("/api/room", makeGroup);      // To contact with new person
app.post("/api/rooms", groupsjoined);

export default app;