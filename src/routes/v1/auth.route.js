const express = require('express');
const authController = require('../../controllers/v1/auth.controller')
const {CheckRefreshToken} = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', authController.Register);
router.post('/login', authController.Login);
router.post('/refresh-token', CheckRefreshToken, authController.RefreshToken);

module.exports = router;