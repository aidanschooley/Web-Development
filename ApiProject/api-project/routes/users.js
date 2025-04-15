var express = require("express");
var router = express.Router();
let users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json(users); // Respond with the list of users
});


router.post("/", function (req, res, next){
  console.log("POST /users works")
  const {name, email} = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Both name and email are required.' });
  }
  const newUser = {
    id: users.length + 1,
    name: name,
    email: email
  };
  users.push(newUser);
  res.status(201).json(newUser)
});

router.put("/:id", function (req, res, next){
  const userId = parseInt(req.params.id);
  const {name, email} = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Both name and email are required.' });
  }
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  if (name) {
    user.name = name
  }
  if (email) {
    user.email = email
  }

  


  res.status(201).json(user)
});

router.delete("/:id", function (req, res, next){
  const userId = parseInt(req.params.id);

  
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const newUsers = users.find(u => u.id !== userId);

  users = newUsers;
  res.status(201).json(user)
});

module.exports = router;
