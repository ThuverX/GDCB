/** Init Window Manager */
require('./modules/internal/ttymanager')()

const fs = require('fs')

// Make sure to insert into global scope
// This is very dirty
const   Discord = require('discord.js')
 global.Discord = Discord
const   client = new Discord.Client()
 global.client = client

const   config = require('./config.json')
 global.config = config

let modules = {}

/** Fetch current modules */
getModules()


/** Module fetcher */
async function getModules(){

    // Make sure modules is empty
    modules = {}

    // Fetch modules from /modules folder
    let names = await fs.readdirSync(__dirname + '/modules/')
    for(name in names){

        // Ignore all internal modules
        if(names[name] !== "internal"){

            let mod = require(__dirname + '/modules/' + names[name])

            // Put the required modules inside the modules var for easy access
            modules[names[name].replace('.js','')] = mod
        }
    }
    console.log("Found modules: " + Object.keys(modules))
}


// TODO: pass Client event listener to modules
client.on('ready', () => {
    console.title(`Logged in as ${client.user.tag}! As ${config.name}`)
})

// TODO: Should also pass tty events to modules
console.events.on('tty',(cmd) => {
    if(cmd === "reload") {
        console.log('Reloading modules')
        getModules()
    }
})

// Message event listener
client.on('message', msg => {

    /*  Check if sender is not a bot
     *  Check if msg uses prefix set in config
     *  Make sure we don't respond to ourself
     */
    if(!msg.member || msg.author.bot || msg.author.id === client.user.id || !msg.content.startsWith(config.prefix)) return

    let command = msg.content.split(' ')[0].slice(1)
    let args = msg.content.split(' ').slice(1)


    // Loop through all mods
    for(mod in modules){
        if(modules[mod].usage === command){

            // General logging
            if(args.length > 0) console.log(msg.member.displayName + " issued command:" + modules[mod].name + " with arguments " + args)
            else console.log(msg.member.displayName + " issued command:" + modules[mod].name)

            modules[mod].call(msg,args)

            // Deleting the users message makes the chat a whole lot cleaner
            if(msg.deletable) msg.delete()
        }
    }

})

console.log("Logging in...")
client.login(config.token)


// Make sure to destroy the client
console.events.on('exit',(Super) => {
    client.destroy()

    Super()
})