const express = require("express");
const { getAllUsers } = require('../controllers/user.controller');
const { signup, login, forgotPassword, resetPassword } = require('../controllers/auth.controller');

const router = express.Router();

router.get("/", getAllUsers);
router.post("/signup", signup);
router.post("/signin", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

module.exports = router;
