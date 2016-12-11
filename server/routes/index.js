const fs =  require('../utils/fsex')

let register = async (app)=>{ 
    let files = await fs.readdir(__dirname)
    files.forEach((file)=>{         
        if(!file.toLowerCase().endsWith('index.js')){    
            console.log(file)        
            let r = require('./' + file)            
            app.use(r.routes())
            app.use(r.allowedMethods())            
        }
    })    
}
module.exports = register