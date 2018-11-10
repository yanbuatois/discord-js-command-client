const discord = require('discord.js');

/**
 * Options for a command
 * @typedef {Object} CommandOptions
 * @property {number} [minArgs=0] Minimum arguments required to trigger the event
 * @property {number} [maxArgs=-1] Maximum arguments allowed to trigger the event
 * @property {boolean} [displayInHelp=true] If false, the command will not be displayed in the help
 * @property {string} [helpMessage="No help available"] Contains the help message displayed when user uses help command
 * @property {UsageMessage} [usageMessage=""] Contains the message displayed when the command is badly used.
 * @property {PermissionResolvable} [requiredPermission=0] Store the permission required to use the command (Will be ignored in DM/Group DM)
 * @property {boolean} [dmAllowed=false] If false, the event isn't triggered when the command is sent by PM
 */
exports.DefaultCommandOptions = {
    minArgs: 0,
    maxArgs: -1,
    displayInHelp: true,
    helpMessage: 'No help available',
    usageMessage: '',
    requiredPermission: 0,
    dmAllowed: false,
};

/**
 * The callback function called when a valid command is typed
 * @typedef {function(message: Message, commandName: string, args: string[])} CommandCallback
 */

/**
 * The usage message. It's a string, but you can type %p, which will be replaced by the prefix, %c, replaced by the command name (without prefix), and %f, replaced by the full command (with prefix)
 * @typedef {string} UsageMessage
 */