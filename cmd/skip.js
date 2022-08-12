const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip to the next song!"),

    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return await interaction.editReply("There are no songs in the queue");

        const currentSong = queue.current;
        queue.skip();
        await interaction.editReply({
            embeds:
                new EmbedBuilder()
                .setDescription(`${currentSong.title} has been skipped!`)
                .setThumbnail(currentSong.thumbnail)
        });
    }
}