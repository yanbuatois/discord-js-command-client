const {Client} = require('discord.js');
const constants = require('util/constants.js');

/**
 * Represents a bot which supports commands.
 * @extends Client
 */
class CommandClient extends Client {
    /**
     * Class constructor
     * @param {string} [prefix='!'] Prefix for commands.
     * @param {ClientOptions} [options={}] Options to be passed to the Client.
     * @constructor
     */
    constructor(prefix = '!', options = {}) {
        super(options);
        /**
         * Prefix of the command
         * @type {string}
         */
        this.prefix = prefix;

        /**
         * All registered commands
         * @type {Object.<string, CommandInfos>}
         */
        this.registeredCommands = [];

        /**
         * Message displayed when usage doesn't have enough privileges to run command.
         * @type {string}
         * @default "You aren't allowed to run this command."
         */
        this.commandNotAllowedMessage = "You aren't allowed to run this command.";

        this.on("message", (message) => {
            if(message.content.startsWith(prefix)) {
                let args = message.content.substr(this.prefix.length).split(' ');
                const commandName = args[0];
                args.shift();

                if(typeof this.registeredCommands[commandName] !== 'undefined') {
                    const commandData = this.registeredCommands[commandName];
                    const commandOptions = commandData.options;
                    const isDm = (message.channel.type === 'dm' || message.channel.type === 'group');

                    if(isDm && !commandOptions.dmAllowed)
                        return;

                    if(args.length < commandOptions.minArgs) {
                        this._displayUsageMessage(message, commandData);
                        return;
                    }

                    if(commandOptions.maxArgs >= 0 && args.length > commandOptions.maxArgs) {
                        this._displayUsageMessage(message, commandData);
                        return;
                    }

                    if(!isDm && commandOptions.requiredPermission !== 0 && message.channel.memberPermissions(message.author).has(commandOptions.requiredPermission)) {
                        this._replyMessage(message, this.commandNotAllowedMessage);
                        return;
                    }

                    commandData.callback(message, commandName, args);
                }
            }
        })
    }

    /**
     * Register a new command
     * @param {string} command Command without the prefix
     * @param {CommandCallback} callback Callback function called when the command is triggered
     * @param {CommandOptions} options Options evaluated when the command is triggered
     */
    registerCommand(command, callback, options = constants.DefaultCommandOptions) {
        /**
         * Stores the informations about the command
         * @typedef {{name: string, callback: CommandCallback, options: CommandOptions}} CommandInfos
         */
        const commandInfos = {
            name: command,
            callback: callback,
            options: options
        };

        this.registeredCommands[command] = commandInfos;
    }

    /**
     * Display the usage message if existing.
     * @param {Message} message the original Discord message
     * @param {CommandInfos} commandInfos
     * @private
     */
    _displayUsageMessage(message, commandInfos) {
        const options = commandInfos.options;
        let usageMessage = options.usageMessage;
        usageMessage.replace("%p", this.prefix);
        usageMessage.replace("%f", this.prefix+commandInfos.name);
        usageMessage.replace("%c", commandInfos.name);
        this._replyMessage(message, "Usage : `" + usageMessage + "`")
    }

    /**
     * Used to reply to a message, an check to avoid errors
     * @param {Message} originalMessage Original message posted by user
     * @param {string} messageToReply Content of the reply
     * @private
     */
    _replyMessage(originalMessage, messageToReply) {
        if(messageToReply !== '' && (message.channel.type === 'dm' || message.channel.type === 'group' || message.channel.memberPermissions(this.user).has("SEND_MESSAGES"))) {
            originalMessage.reply(messageToReply);
        }
    }

}

exports.CommandClient = CommandClient;