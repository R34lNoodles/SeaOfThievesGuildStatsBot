const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const puppeteer = require("puppeteer");
const moment = require("moment");

// Define previousGuildLevel outside the client.getGuildInfo function
let previousGuildLevel = null;

module.exports = (client) => {
  client.getGuildInfo = async () => {
    try {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"
      );

      await page.goto(
        `https://www.seaofthieves.com/profile/guilds/${process.env.seaofthievesguildid}/`,
        { waitUntil: "domcontentloaded" }
      );
      await page.waitForSelector(
        "._1XuCi2WhiqeWRUVp3pnFG3.erL690_8JwUW-R4bJRcfl"
      );
      await page.click("._1XuCi2WhiqeWRUVp3pnFG3.erL690_8JwUW-R4bJRcfl");
      const logoutButton = await page.$(
        '.button--standard[aria-label="Logout"]'
      );
      if (logoutButton) {
        console.log("User is already logged in.");
      } else {
        console.log("Authenticating.....");
        await page.click(
          '.button--standard[aria-label="Login to your account"]'
        );

        await page.waitForNavigation({ waitUntil: "domcontentloaded" });
        // EMAIL
        await page.waitForSelector("#i0116");
        await page.type("#i0116", process.env.microsoftloginemail);
        await page.click("#idSIButton9");
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });
        // PASSWD
        await page.waitForSelector("#i0118");
        await page.type("#i0118", process.env.microsoftloginpass);
        await page.keyboard.press("Enter");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await page.keyboard.press("Enter");
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto(
          `https://www.seaofthieves.com/profile/guilds/${process.env.seaofthievesguildid}/`,
          { waitUntil: "domcontentloaded" }
        );
        await page.click(
          '.button--standard[aria-label="Login to your account"]'
        );
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await page.keyboard.press("Enter");
        console.log("Authentication successful!");
      }

      const fs = require("fs");
      const getPreviousGuildLevel = () => {
        try {
          const data = fs.readFileSync("previousGuildLevel.json");
          return JSON.parse(data);
        } catch (error) {
          console.error("Error reading previous guild level:", error);
          return null;
        }
      };
      const savePreviousGuildLevel = (guildLevel) => {
        try {
          fs.writeFileSync(
            "previousGuildLevel.json",
            JSON.stringify(guildLevel)
          );
        } catch (error) {
          console.error("Error saving previous guild level:", error);
        }
      };
      let previousGuildLevel = getPreviousGuildLevel();
      const checkAndUpdateGuildLevel = async () => {
        try {
          const guildLevelElement = await page.waitForSelector(
            ".guild-roundel__level",
            { visible: true }
          );
          if (guildLevelElement) {
            const guildLevel = await page.evaluate(
              (element) => element.innerHTML,
              guildLevelElement
            );

            if (guildLevel !== previousGuildLevel) {
              console.log("Guild Level Updated:", guildLevel);
              previousGuildLevel = guildLevel;
              savePreviousGuildLevel(guildLevel);
              const guildEmbed = new EmbedBuilder()
                .setColor("#6a2882")
                .setDescription(`🏆 Reputation ${guildLevel} reached!`)
                .setTimestamp();
              client.channels.cache.get(process.env.sotGuildChannel).send({
                ephemeral: true,
                embeds: [guildEmbed],
              });
            }
          } else {
            console.warn("Guild level element not found.");
          }
        } catch (error) {
          console.error(
            "Error occurred while checking and updating guild level:",
            error
          );
        }
      };
      await checkAndUpdateGuildLevel();

      setInterval(checkAndUpdateGuildLevel, 5000);
      setInterval(async () => {
        try {
          await page.reload({ waitUntil: "domcontentloaded" });
          console.log("Page refreshed at: ", new Date());
        } catch (error) {
          console.error("Error occurred while refreshing page:", error);
          if (error.message.includes("Execution context was destroyed")) {
            console.log("Waiting for page to stabilize...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
            console.log("Attempting to reload the page again...");
            await page.reload({ waitUntil: "domcontentloaded" });
            console.log("Page reloaded successfully.");
          }
        }
      }, 50000);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };
};
