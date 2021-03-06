# Discord.js Command Client
Discord.js Command Client is a Node.js module, used to extend Discord.js features, 
and to facilitate commands registration.

# Installation
`npm install discord-js-command-client`

# Getting started
This module is pretty simple to use. First, you need to install it. Its use is
similar to Discord.js with the CommandClient class, replacing
the Client class from the Discord.js module. You can pass the command's prefix as a
parameter when creating the bot. Default prefix is `!`.
```javascript
const {CommandClient} = require('discord-js-command-client');

const client = new CommandClient('!'); // Equivalent to
const client = new CommandClient();

client.login('super-secret-token');
```

Then you can register commands on this client by the method `registerCommand()`. This
method takes 3 parameters. First, the command name, without the prefix. For example, 
`"echo"`. Then you will type the callback function, called when the command is typed
by an user. This callback function takes 3 parameters. The first is the `Message` object,
as used by Discord.js, with author and so on. Then, it's a string, with the command name,
without the prefix (for example : `"echo"`, if  I typed `!echo this is a message`). The
third parameter is a string array, with all parameters passed to the method. For example,
if the user typed `!echo this is a message`, the array will contain `['this', 'is',
'a', 'message']`.

The third parameter in the `registerCommand()` method is an Object, with key-value pairs.
You can tell which condition(s) must be followed to trigger the event. All the options
will be detailed following. The full example for our `echo` command is :
```javascript
const {CommandClient} = require('discord-js-command-client');

const client = new CommandClient();

client.registerCommand("echo", (message, commandName, args) => {
    const reply = args.join(' ');
    message.channel.send(reply);
}, {
    minArgs: 1,
    usageMessage: `%f <Message>`,
    dmAllowed: true,
});

client.login('super-secret-token');
```

You can delete an existing command by using the `unregisterCommand()` method, with, as
only parameter, the command name. To unregister our `echo` command, the code is the
following :
```javascript
client.unregisterCommand("echo");
```

Finally, you can edit existing commands, with `editCommandData()` (which have same
definition than the `registerCommand()` method), and `editCommandOptions()` which
don't require to override existing callback. The two parameters are the name of the
command and the Object containing options.
```javascript
client.editCommandData("echo", (message, commandName, args) => {
    message.channel.send(args[0]);
})
``` 

# Documentation
You can find complete documentation here: [https://yanbuatois.github.io/discord-js-command-client/](https://yanbuatois.github.io/discord-js-command-client/ "JSDoc").
There is a complete list of elements added by this modules, and different options available.

# Contributing
Feel free to contribute if you find bugs, or if you have improvement ideas. Don't hesitate to
indicate if there is english fault.
