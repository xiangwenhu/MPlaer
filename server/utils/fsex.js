const fs = require('fs')

module.exports =  {
    get readdir(){
        return dir => {
            return new Promise(function (resolve, reject) {
                fs.readdir(dir, function (err, files) {
                    if(err){
                        return reject(err)
                    }      
                    console.log(files)    
                    resolve(files)
                })
            })
        }
    }
}

