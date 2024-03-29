const http = require("http");
const bot_config = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const app = require("express")();
const bot = new Discord.Client({disableEveryone: true});
const prefix = bot_config.prefix;
bot.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) =>{
    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0){
        return console.log("Couldnt find commands.");
    }
    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
});
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});
bot.on("ready", async() => {
    bot.channels.get('588879387475312660').send(`EmbedBot is online back online running on port \`${PORT}\``);
    bot.user.setActivity("Broome County, California", {type: "PLAYING"});
});
bot.on("message", async message => {
   if (message.author.bot) return;
   if (message.channel.type === "dm") return;
   let messageArray = message.content.split(" ");
   let cmd = messageArray[0].toLowerCase();
   let args = messageArray.slice(1);
   // Functions
   if (message.content.startsWith(prefix)){
       let commandFile = bot.commands.get(cmd.slice(prefix.length));
       if (commandFile) await commandFile.run(bot,message,args);
   }
});
// Prevent exit 143 (Idle exit)
function startKeepAlive() {
    setInterval(function() {
        let options = {
            host: 'broomeembedbot.herokuapp.com',
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