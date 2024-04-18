const express = require('express');
const userController = require('../../controllers/v1/user.controller')
const {CheckAccessToken: CheckAuth} = require('../../middlewares/auth');

const router = express.Router();

router.get('/', CheckAuth, userController.GetUsers);
router.get('/:id', userController.GetUserById);
router.patch('/:id', CheckAuth, userController.UpdateUser);
router.patch('/ban/:id', CheckAuth, userController.BanUser);

module.exports = router;