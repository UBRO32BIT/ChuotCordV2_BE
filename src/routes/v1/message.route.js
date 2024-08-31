const express = require('express');
const messageController = require('../../controllers/v1/message.controller');
const {CheckAccessToken: CheckAuth} = require('../../middlewares/auth')

const router = express.Router({ mergeParams: true });

router.get('/', CheckAuth, messageController.GetMessagesByChannelId);

module.exports = router;