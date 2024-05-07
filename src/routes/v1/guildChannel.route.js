const express = require('express');
const channelController = require('../../controllers/v1/guildChannel.controller')
const {CheckAccessToken: CheckAuth} = require('../../middlewares/auth')

const router = express.Router({ mergeParams: true });

router.get('/', CheckAuth, channelController.GetChannelsByGuildId);
router.get('/:channelId', CheckAuth, channelController.GetChannelById);
router.post('/', CheckAuth, channelController.CreateChannel);
router.patch('/:channelId', CheckAuth, channelController.UpdateChannel);
router.delete('/:channelId', CheckAuth, channelController.DeleteChannel);

module.exports = router;