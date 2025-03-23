const express = require("express");
const { getAllUsers } = require('../controllers/user.controller');
const { signup, login } = require('../controllers/auth.controller');

const router = express.Router();

router.get("/", getAllUsers);
router.post("/signup", signup);
router.post("/signin", login);

module.exports = router;
