
// Example module
module.exports = {
    name:"refer",
    usage:"refer",
    // Additional information should be added

    call:(msg,args) => {

        // This check should already be clear, but just to be sure
        if(!msg.guild) return

        // Find the message
        msg.guild.channels.forEach((channel) => {

            // Checking voice channels will crash the bot
            if(channel.type == "text"){
                channel.fetchMessage(args[0]).then(e => {
                    let embed = {
                        description:e.content,
                        color:e.member.displayColor,
                        footer:{
                            text:e.author.username,
                            icon_url:e.author.avatarURL
                        }
                    }
                    msg.channel.send("",{embed})
                })
            }
        })
        
    }
}