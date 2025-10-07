// server.js

import 'dotenv/config';
import express from 'express';
import connect from './database/conn.js'; // Your excellent connection file
import usersRouter from "./routes/userRoute.js";
import cors from 'cors';
import { getChat } from './fetch/getchat.js';
import './control/chat.js';
import { makeGroup } from './control/room.js';
import { createUser } from './controllers/userController.js';
import { groupsjoined } from './fetch/getrooms.js';

const app = express();

// --- Middlewares ---

// It's good practice to set up CORS first.
// Remember to make this more secure for production!
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- !! IMPORTANT CHANGE HERE !! ---
// REMOVE the old database connection call from here:
// connect().catch((err) => { ... });

// ADD this middleware to ensure the DB is connected for every request.
app.use(async (req, res, next) => {
    try {
        await connect(); // This will use the cached connection if available
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Database connection failed for request!", error);
        // Stop the request chain and send an error response
        res.status(500).json({ error: "Internal Server Error: Could not connect to the database." });
    }
});


// --- API Routes ---
// Now that the middleware is in place, all these routes are guaranteed
// to have a database connection ready.

app.get("/", (req, res) => {
    res.send("Hello World! This is the root of the API.");
});

app.post("/signup", createUser);
app.use("/users", usersRouter);

app.post("/api/places", async (req, res) => {
    console.log(req.body);
    res.json({ message: "received" });
});

app.get("/api/getchat", getChat);
app.post("/api/room", makeGroup);
app.post("/api/rooms", groupsjoined);


// Export the app instance for Vercel
export default app;