const events = require('events')

// This needs to be less dirty
function exitSuper(){
    console.reset()
    return process.exit()
}

module.exports = () => {

    console.events = new events.EventEmitter()

    let title = "";

    let cmd = "";

    let log = []


    let stdin = process.stdin
    stdin.setRawMode(true)
    stdin.resume()


    // Quick input listener
    stdin.setEncoding( 'utf8' );
    stdin.on( 'data', function( key ){
        if ( key === '\u0003' ) {
            console.events.emit('exit',exitSuper)
        }

        else if(key === '\u0008'){
            cmd = cmd.slice(0,-1)
        }

        else if(key === '\u000D'){
            if(cmd == "exit"){
                console.events.emit('exit',exitSuper)
            }

            console.events.emit('tty',cmd)
            cmd = ""
        }
        else{
            cmd += key
        }
        console.render()
    })
      
      

    // Set current title 
    console.title = (text) => {
        title = text;
    }

    console.colors = require('./ttycolors')

    // General Logging
    console.log = (content) => {
        log.push({content,date:new Date()})
        console.render()
    }

    // General Error logging
    console.error = (content) => {
        //TODO: fix this
        clearInterval(loop)
        log.push({content: console.colors.FgRed + content.toString() + console.colors.Reset,date:new Date()})
        console.render(true)
    }

    // INTERNAL: Render to log
    console.render = (w) => {
        console.reset()
        if(!w) console.window()

        let maxHeight = process.stdout.rows - 2

        // Cover the whole tty
        for(let i = 0; i <= maxHeight;i++ ){
            if(maxHeight - i > 0){
                if(i < log.length){
                    let time = log[log.length - i - 1].date.toLocaleString().split(' ')[1] 
                    let content = log[log.length - i - 1].content
                    process.stdout.write(console.colors.FgCyan + "[" + time+"] " + console.colors.Reset + content  + "\n")
                }else{
                    process.stdout.write("\n")
                }
            }
        }
        process.stdout.write(cmd)
    }

    // Clears the console
    console.reset = () => {
        return process.stdout.write('\x1B[2J\x1B[0f')
    }

    // INTERNAL: Shows a top bar for time and text
    console.window = () => {

        let time = new Date().toLocaleString()
        let width = process.stdout.columns - title.length - time.length

        // Should maybe use white space chars instead of "X"
        let empty = Array.from({length:width},() => "X").join('')

        return process.stdout.write(console.colors.BgWhite + console.colors.FgBlack + title + console.colors.FgWhite + empty + console.colors.FgBlack + time + console.colors.Reset + "\n")
    }

    // Init the loop
    let loop = setInterval(console.render,1000)
}