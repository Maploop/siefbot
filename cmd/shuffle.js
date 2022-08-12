const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffle the current playlist"),

    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return await interaction.editReply("There are no songs in the queue");

        queue.shuffle();
        await interaction.editReply("The queue is now being shuffled!");
    }
}