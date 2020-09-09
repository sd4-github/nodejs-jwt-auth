const express = require("express");
const router = express.Router();
const authcontroller = require("../controllers/authcontroller");
const auth = require("../middleware/isAuth");

router.post("/signup", authcontroller.signup);
router.post("/login", authcontroller.login);
router.get('/userdetails/:_id', auth, authcontroller.userDetails);

module.exports = router;