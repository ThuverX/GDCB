
// Displays info about this bot
module.exports = {
    name:"info",
    usage:"info",
    // You can add extra vars here to grab

    call:(msg,args) => {

        // Use the global scope to access config, client or Discord
        let embed = {
            title:"Info about this bot",
            description:"This bot was created by **@ThuverX#9814**.",
            footer:{
                text:global.config.name,
                icon_url:global.config.icon
            }
        }
        msg.channel.send("",{embed})
    }
}