const {Client} = require('discord.js');
const constants = require('util/constants.js');

/**
 * Represents a bot which supports commands.
 * @extends Client
 */
class CommandClient extends Client {
    /**
     * Class constructor
     * @param {string} prefix Prefix for commands.
     * @param {ClientOptions} options Options to be passed to the Client.
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
         * All regitered commands
         * @type {Object.<string, CommandInfos>}
         */
        this.registeredCommands = [];

        this.on("message", (message) => {
            if(message.content.startsWith(prefix)) {
                let args = message.content.substr(this.prefix.length).split(' ');
                const commandName = args[0];
                args.shift();

                if(Object.keys(this.registeredCommands).includes(commandName)) {

                }
            }
        })
    }

    /**
     * Register a new command
     * @param {string} command Command without the prefix
     * @param {function(message: Message,commandName: string,args: string[])} callback Callback function called when the command is triggered
     * @param {CommandOptions} options Options evaluated when the command is triggered
     */
    registerCommand(command, callback, options = constants.DefaultCommandOptions) {
        /**
         * Stores the informations about the command
         * @typedef {{callback: (function(message: Message, commandName: string, args: string[])), options: CommandOptions}} CommandInfos
         */
        const commandInfos = {
            callback: callback,
            options: options
        };

        this.registeredCommands[command] = commandInfos;
    }
}

exports.CommandClient = CommandClient;