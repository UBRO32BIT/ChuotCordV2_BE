const express = require('express');
const guildRoleController = require('../../controllers/v1/guild_role.controller')
const {CheckAccessToken: CheckAuth} = require('../../middlewares/auth');
const AuthorizeGuild = require('../../middlewares/guild');

const router = express.Router();

// router.get('/', CheckAuth, guildRoleController.GetRoles);
// router.get('/:id', CheckAuth, guildRoleController.GetRoleById);
// router.post('/', CheckAuth, guildRoleController.CreateRole);
// router.patch('/:id', CheckAuth, guildRoleController.UpdateRole);
// router.delete('/:id', CheckAuth, AuthorizeGuild, guildRoleController.DeleteRole);

module.exports = router;