const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Stop playing"),

    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return await interaction.editReply("There are no songs in the queue");

        queue.destroy();
        await interaction.editReply("Bye bye :c");
    }
}