const express = require('express');
const userController = require('../../controllers/v1/user.controller')
const {checkAccessToken: CheckAuth} = require('../../middlewares/auth');

const router = express.Router();

router.get('/', CheckAuth, userController.GetUsers);
router.get('/guilds', CheckAuth, userController.GetGroupsByUserId);
router.get('/:id', userController.GetUserById); 
router.patch('/update', CheckAuth, userController.UpdateUser);
router.patch('/ban/:id', CheckAuth, userController.BanUser);

module.exports = router;