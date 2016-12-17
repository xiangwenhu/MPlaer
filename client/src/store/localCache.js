export default {
    getCache(key){
        let data = localStorage.getItem(key)
        return JSON.parse(data)
    },
    setCache(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    }
}