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
        "What is this bot?\n This bot is an open source discord bot developed by noodles that scrapes the Sea of Thieves website for guild information since they do not have an API for the guild."
      )
      .addFields({
        name: "Features",
        value: "•  Guild Levelup Notifications\n  `More features coming soon`",
        inline: true,
      })
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
