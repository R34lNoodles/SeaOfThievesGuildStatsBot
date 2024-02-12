const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`✅-${client.user.tag}`);

    client.user.setPresence({
      activities: [{ name: `Agents of Mischief`, type: ActivityType.Watching }],
      status: "online",
    });
  },
};
