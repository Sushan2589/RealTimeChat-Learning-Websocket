import express from "express";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(express.json());

const DB = "data/db.json";

function readDB() {
  try {
    const data = fs.readFileSync(DB, "utf-8");
    return JSON.parse(data);
  } catch(error) {
    console.log("Error reading database:", error);
  return { users: [], conversations: [] };
}
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.log("Error writing to database:", error);
  }
}

//User Register

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  const db = readDB();

  const existingUser = db.users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase(),
  ); //Extra checking so that format matches and no error happen
  if (existingUser) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const newUser = { username, password };
  db.users.push(newUser);
  saveDB(db);
  res.status(201).json({ message: "User registered successfully" });
});


//Search user

app.get("/users",(req,res)=>{
    const search = req.query.username || ""; //Default to empty string if no search query provided

    const db = readDB();
    
    const users = db.users
    .filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    )
    .map((user) => ({
      id: user.id,
      username: user.username
    }));

  res.json(users);
});


    app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
