const express = require('express');
const guildController = require('../../controllers/v1/guild.controller')
const {CheckAccessToken: CheckAuth} = require('../../middlewares/auth');
const channelRoute = require('./guildChannel.route');
const roleRoute = require('./guildRole.route');
const AuthorizeGuild = require('../../middlewares/guild');

const router = express.Router();

router.get('/', CheckAuth, guildController.GetGuilds);
router.get('/:id', CheckAuth, guildController.GetGuildById);
router.post('/', CheckAuth, guildController.CreateGuild);
router.patch('/:id', CheckAuth, guildController.UpdateGuild);
router.delete('/:id', CheckAuth, AuthorizeGuild, guildController.DeleteGuild);

//Routes for guild channels
router.use('/:id/channels', channelRoute);
//Routes for guild roles
router.use('/:id/roles', roleRoute);

module.exports = router;