import passport from "passport";
import { Auth } from "../controllers/auth";

const express = require('express');

const router = express.Router();

router.post('/login', passport.authenticate('local'), Auth.login);

router.post('/logout', Auth.logout);

module.exports = router;
