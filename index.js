const http = require("http");
const app = require("express")();
const Discord = require("discord.js");
const PORT = process.env.PORT || 3000;
const bot = new Discord.Client({disableEveryone: true});

app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

bot.on("ready", async () => {
    bot.channels.get('588879387475312660').send(`Bot is online running on port \`${PORT}\`.`);
    bot.user.setActivity("Broome County, California", {type: "PLAYING"});
});

// Prevent exit 143 (Idle exit)
function startKeepAlive() {
    setInterval(function() {
        let options = {
            host: 'kingcity-bot.herokuapp.com',
            port: 80,
            path: '/'
        };
        http.get(options, function(res) {
            res.on('data', function(chunk) {
                try {
                    console.log("Heroku Awake: Prevented 143");
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function(err) {
            console.log("Error: " + err.message);
        });
    }, 20 * 60 * 1000); // load every 20 minutes
}
startKeepAlive(); // Keep from idling
bot.login(process.env.token).catch(err => console.log(err));