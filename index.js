const {Client} = require('discord.js');
const constants = require('./util/constants.js');

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
         * Set if the help is enabled
         * @type {boolean}
         */
        this.enableHelp = true;

        /**
         * All registered commands
         * @type {Object.<string, CommandInfos>}
         * @private
         */
        this._registeredCommands = [];

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

                if(typeof this._registeredCommands[commandName] !== 'undefined') {
                    const commandData = this._registeredCommands[commandName];
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
        });

        this.registerCommand("help", (message) => {
            if(this.enableHelp) {
                const dm = (message.channel.type === 'dm' || message.channel.type === 'group');
                if (dm || message.channel.memberPermissions(this.user).has("SEND_MESSAGES")) {
                    let help = '';
                    for(let key in this._registeredCommands) {
                        if(this._registeredCommands.hasOwnProperty(key)) {
                            let commandData = this._registeredCommands[key];
                            if (commandData.options.displayInHelp) {
                                if (!dm || commandData.options.dmAllowed) {
                                    help += `\`${this.prefix}${commandData.name}\`: ${commandData.options.helpMessage}\n`;
                                }
                            }
                        }
                    }
                    if(help !== '') {
                        message.channel.send(help);
                    }
                }
            }

        }, {
            helpMessage: "List all available commands and their usages",
            dmAllowed: true
        })
    }

    /**
     * Register a new command
     * @param {string} command Command without the prefix
     * @param {CommandCallback} callback Callback function called when the command is triggered
     * @param {CommandOptions} [options={}] Options evaluated when the command is triggered
     */
    registerCommand(command, callback, options = {}) {
        let o = {};
        Object.assign(o, constants.DefaultCommandOptions);
        Object.assign(o, options);

        /**
         * Stores the informations about the command
         * @typedef {{name: string, callback: CommandCallback, options: CommandOptions}} CommandInfos
         */
        const commandInfos = {
            name: command,
            callback: callback,
            options: o,
        };

        this._registeredCommands[command] = commandInfos;
    }

    /**
     * Unregisters a command if registered
     * @param {string} command Command to unregister
     */
    unregisterCommand(command) {
        if(typeof this._registeredCommands[command] !== 'undefined') {
            delete this._registeredCommands[command];
        }
    }

    /**
     * Edit command datas (callback, and options, if specified)
     * @param {string} command The command to edit
     * @param {CommandCallback} callback The new callback function
     * @param {CommandOptions} [options={}] The options to edit (if an existing option isn't set, its value will be unchanged)
     */
    editCommandData(command,callback,options = {}) {
        if(typeof this._registeredCommands[command] !== 'undefined') {
            this._registeredCommands[command].callback = callback;
            Object.assign(this._registeredCommands[command].options, options);
        }
    }

    /**
     * Edit command options
     * @param {string} command The command to edit
     * @param {CommandOptions} options The options to edit (if an existing option isn't set, its value will be unchanged)
     */
    editCommandOptions(command, options) {
        if(typeof this._registeredCommands[command] !== 'undefined') {
            Object.assign(this._registeredCommands[command].options, options);
        }
    }

    /**
     * Display the usage message if existing.
     * @param {Message} message the original Discord message
     * @param {CommandInfos} commandInfos
     * @private
     */
    _displayUsageMessage(message, commandInfos) {
        const options = commandInfos.options;
        if(options.usageMessage !== '') {
            let usageMessage = options.usageMessage;
            usageMessage = usageMessage.replace("%p", this.prefix);
            usageMessage = usageMessage.replace("%f", this.prefix + commandInfos.name);
            usageMessage = usageMessage.replace("%c", commandInfos.name);
            this._replyMessage(message, "Usage: `" + usageMessage + "`")
        }
    }

    /**
     * Used to reply to a message, an check to avoid errors
     * @param {Message} originalMessage Original message posted by user
     * @param {string} messageToReply Content of the reply
     * @private
     */
    _replyMessage(originalMessage, messageToReply) {
        if(messageToReply !== '' && (originalMessage.channel.type === 'dm' || originalMessage.channel.type === 'group' || originalMessage.channel.memberPermissions(this.user).has("SEND_MESSAGES"))) {
            originalMessage.reply(messageToReply);
        }
    }

}

exports.CommandClient = CommandClient;