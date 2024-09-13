const express = require('express');
const guildController = require('../../controllers/v1/guild.controller')
const guildInviteController = require('../../controllers/v1/guildInvite.controller')
const {checkAccessToken: CheckAuth} = require('../../middlewares/auth');
const channelRoute = require('./guildChannel.route');
const roleRoute = require('./guildRole.route');
const {AuthorizeGuild, ValidateRemoveMember} = require('../../middlewares/guild');

const router = express.Router();

router.get('/', CheckAuth, guildController.GetGuilds);
router.get('/:id', CheckAuth, guildController.GetGuildById);
router.post('/', CheckAuth, guildController.CreateGuild);
router.patch('/:id', CheckAuth, AuthorizeGuild, guildController.UpdateGuild);
router.patch('/:id/remove-member/:memberId', CheckAuth, AuthorizeGuild, ValidateRemoveMember, guildController.RemoveMemberFromGuild);
router.delete('/:id', CheckAuth, AuthorizeGuild, guildController.DeleteGuild);

//Routes for guild channels
router.use('/:id/channels', channelRoute);
//Routes for guild roles
router.use('/:id/roles', roleRoute);
//Router for guild invites
router.post('/:id/invites', CheckAuth, guildInviteController.CreateInvite);
router.get('/:id/invites', CheckAuth, guildInviteController.GetInvitesByGuildId);

module.exports = router;