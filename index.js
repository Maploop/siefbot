const Discord = require('discord.js');
const {REST} = require('@discordjs/rest');
const { Routes } = require("discord-api-types/v9")
const fs = require('fs');
const {Player} = require('discord-player');

require('dotenv').config();
const TOKEN = process.env.TOKEN;

const LOAD_SLASH_CMD = process.argv[2] == "load";
const CLIENT_ID = "1007338098662850630";
const GUILD_ID = "1006908400262725632";

const myIntents = new Discord.IntentsBitField();
myIntents.add(Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildVoiceStates);
const client = new Discord.Client({
    intents: myIntents
});

client.slashCommands = new Discord.Collection();
client.player = new Player(client, {
    ytdlOptions: {
        filter: "audioonly",
        opusEncoded: true,
        highWaterMark: 1 << 25,
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
    }
});

let commands = [];

const cmdFile = fs.readdirSync("./cmd").filter(file => file.endsWith(".js"));
for (file of cmdFile) {
    const slashCommand = require(`./cmd/${file}`);
    client.slashCommands.set(slashCommand.data.name, slashCommand);
    if (LOAD_SLASH_CMD) commands.push(slashCommand.data.toJSON());
}

if (LOAD_SLASH_CMD) {
    const rest = new REST({
        version: "9"
    }).setToken(TOKEN);
    console.log("Loading slash commands...");
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body:commands})
    .then(() => {
        console.log("Finished loading slash commands.");
        process.exit(0);
    })
    .catch((err) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
    })
} else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`);
    });
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return;
            const cmd = client.slashCommands.get(interaction.commandName);
            if (!cmd) interaction.reply("Not a valid slash command!");

            await interaction.deferReply();
            await cmd.run({client, interaction});
        }
        handleCommand();
    })
    client.login(TOKEN);
}