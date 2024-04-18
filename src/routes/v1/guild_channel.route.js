const express = require('express');
const channelController = require('../../controllers/v1/guild_channel.controller')
const {CheckAccessToken: CheckAuth} = require('../../middlewares/auth')

const router = express.Router();

router.get('/', CheckAuth, channelController.GetChannelsByGuildId);
router.get('/:id', CheckAuth, channelController.GetChannelById);
router.post('/', CheckAuth, channelController.CreateChannel);
router.patch('/:id', CheckAuth, channelController.UpdateChannel);
router.delete('/:id', CheckAuth, channelController.DeleteChannel);

module.exports = router;