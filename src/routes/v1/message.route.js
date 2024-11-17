const express = require('express');
const upload = require('../../config/multer.config');
const messageController = require('../../controllers/v1/message.controller');
const {checkAccessToken: CheckAuth} = require('../../middlewares/auth')

const router = express.Router({ mergeParams: true });

router.get('/', CheckAuth, messageController.GetMessagesByChannelId);
router.post("/", CheckAuth, upload.array("files"), messageController.AddMessage);

module.exports = router;