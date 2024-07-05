const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Information for the bot."),
  async execute(interaction, client) {
    const botInfo = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Bot Information")
      .setURL("https://github.com/LoneNoodle")
      .setDescription(
        "This is a bot that scrapes the Sea of thieves websitr for guild info and puts it in a readable format."
      )
      .setTimestamp()
      .setFooter({
        text: "Created By Noodles",
      });
    const message = await interaction.reply({
      ephemeral: true,
      embeds: [botInfo],
    });
  },
};
