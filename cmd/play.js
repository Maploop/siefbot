const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');
const {QueryType} = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Loading songs from YouTube")
        .addSubcommand((sub) => 
    sub.setName("song")
        .setDescription("Plays a song from the provided URL").addStringOption((op) => op.setName("url").setDescription("Song URL").setRequired(true)))
        .addSubcommand((sub) => 
    sub.setName("playlist")
        .setDescription("Loads a playlist of songs from a query").addStringOption((op) => op.setName("url").setDescription("The Playlist URL").setRequired(true)))
        .addSubcommand((sub) => 
    sub.setName("search")
        .setDescription("Search for a song!")
        .addStringOption((op) => op.setName("searchquery").setDescription("Keywords of the search").setRequired(true))),

    run: async ({client, interaction}) => {
        if (!interaction.member.voice.channel)
            return interaction.editReply("You need to be in a voice channel to use this.");

        const queue = await client.player.createQueue(interaction.guild);
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new EmbedBuilder();
        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url");
            const song = await client.player.search(url, {
                requestedBy: interaction.user
            }).then(x => x.tracks[0]);
            if (!song) return interaction.editReply("No matches found");

            await queue.addTrack(song);
            embed.setDescription(`**[${song.title}](${song.url})** has been added to the queue`).setThumbnail(song.thumbnail)
            .setFooter({text: `Duration: ${song.duration}`});
        } else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url");
            const result = await client.player.search(url, {
                requestedBy: interaction.user
            })
            if (result.tracks.length === 0) return interaction.editReply("No matches found");

            const playlist = result.playlist;
            await queue.addTracks(result.tracks);
            embed.setDescription(`** ${result.tracks.length} songs from [${playlist.title}](${playlist.url})** has been added to the queue`).setThumbnail(playlist.thumbnail);
        } else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchquery");
            const result = await client.player.search(url, {
                requestedBy: interaction.user
            })
            if (result.tracks.length === 0) return interaction.editReply("No matches found");

            const song = result.tracks[0];
            await queue.addTrack(song);
            embed.setDescription(`**[${song.title}](${song.url})** has been added to the queue`).setThumbnail(song.thumbnail)
            .setFooter({text: `Duration: ${song.duration}`});
        }

        if (!queue.playing) await queue.play();
        await interaction.editReply({
            embeds: embed
        });
    }
}