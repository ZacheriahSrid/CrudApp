const express = require("express");
const users = require("./sample.json");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 8001;

app.use(cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PATCH", "DELETE"],
}));

app.use(express.json());

app.get("/users", (req, res) => {
    return res.json(users);
});

app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user) => user.id !== id);
    fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete user" });
        }
        return res.json(filteredUsers);
    });
});

app.post("/users", (req, res) => {
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({ message: "All fields are required" });
    }
    let id = Date.now();
    users.push({ id, name, age, city });

    fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to add user" });
        }
        return res.json({ message: "User details added successfully" });
    });
});

app.patch("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({ message: "All fields are required" });
    }

    let index = users.findIndex((user) => user.id === id);
    users[index] = { id, name, age, city };

    fs.writeFile("./sample.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to update user" });
        }
        return res.json({ message: "User details updated successfully" });
    });
});

app.listen(port, (err) => {
    if (err) {
        console.error("Error starting server:", err);
    } else {
        console.log(`App is running on port ${port}`);
    }
});
