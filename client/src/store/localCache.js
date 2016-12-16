export default {
    getCache(key){
        let data = localStorage.getItem(key)
        return data !== null ? JSON.parse(data):null
    },
    setCache(key,value){
        localStorage.setItem(key,JSON.stringify(value))
    }
}