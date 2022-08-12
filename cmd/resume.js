const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the music"),

    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return await interaction.editReply("There are no songs in the queue");

        queue.setPaused(false);
        await interaction.editReply("The music is now playing once again!");
    }
}