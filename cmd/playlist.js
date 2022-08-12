const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');
const fs = require('fs');
const { stringify } = require('querystring');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Grab someone's playlist!")
        .addStringOption((option) => option.setName("name").setDescription("The name of the playlist you're looking for").setRequired(true)),

    run: async ({client, interaction}) => {
        let option = interaction.options.getString("name");
        let text = fs.readFileSync('./db.json', 'utf-8')
        let json = JSON.parse(text);

        let url = json['playlists'][option]['url']
        let thumbnailUrl = json['playlists'][option]['thumbnailUrl']
        
        await interaction.editReply({
            embeds: 
                new EmbedBuilder()
                .setTitle(option + " Playlist")
                .setDescription(url)
                .setThumbnail(thumbnailUrl)
        })
    }
}