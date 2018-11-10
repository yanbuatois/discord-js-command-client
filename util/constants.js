const discord = require('discord.js');

/**
 * Options for a command
 * @typedef {Object} CommandOptions
 * @property {number} [minArgs=0] Minimum arguments required to trigger the event
 * @property {number} [maxArgs=-1] Maximum arguments allowed to trigger the event
 * @property {boolean} [displayInHelp=true] If false, the command will not be displayed in the help
 * @property {string} [helpMessage="No help available"] Contains the help message displayed when user uses help command
 * @property {PermissionResolvable} [requiredPermission=0] Store the permission required to use the command
 * @property {boolean} [pmAllowed=false] If false, the event isn't triggered when the command is sent by PM
 */
exports.DefaultCommandOptions = {
    minArgs: 0,
    maxArgs: -1,
    displayInHelp: true,
    helpMessage: 'No help available',
    requiredPermission: 0,
    pmAllowed: false,
};