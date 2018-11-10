const config = require('./config.js');

const {CommandClient} = require('../index.js');
const client = new CommandClient(config.prefix);

client.on('ready', () => {
    console.log("Bot ready.");
});

client.registerCommand("ping", (message) => {
    message.reply("Pong");
}, {maxArgs: 0});

client.registerCommand("echo", (message, command, args) => {
    const reply = args.join(' ');
    message.channel.send(reply);
}, {
    minArgs: 1,
    usageMessage: `%f <Message>`,
    dmAllowed: true,
});

client.login(config.token);
