const defaultOptions = {
    headers:{
        isFetch:1
    }
}

export default {
    baseUrl:'/api/',
    fetchData(url,options = defaultOptions){
        return new Promise((resolve,reject)=>{
            fetch(url,options).then(response=>response.json())
            .then(data=>resolve(data)).catch(err=>reject(err))
        })
    },
    async search(title){
       let datas = await this.fetchData(this.baseUrl + 'search/'+ title)
       return datas
    },
    async songDetail(id){
        let data  = await this.fetchData(this.baseUrl + 'song/detail/' + id)
        return data
    },    
    async artistIfo(uid){
        let data  = await this.fetchData(this.baseUrl + 'artist/info/' + uid)
        return data
    },
    async lry(id){
        let data  = await this.fetchData(this.baseUrl + 'lry/' + id)
        return data
    },
    async hotSongs(){
        let data = await this.fetchData(this.baseUrl + 'getAll?query=' + encodeURIComponent('from=qianqian&version=2&method=baidu.ting.billboard.billList&format=json&type=2&offset=0&size=50') )
        return data    
    },
    async channels(){
        let data = await this.fetchData(this.baseUrl + 'getAll?query=' + encodeURIComponent('from=qianqian&version=2&method=baidu.ting.radio.getCategoryList&format=json') )
        return data    
    },
    async channelSongs(cname){
        let data = await this.fetchData(this.baseUrl + 'getAll?query=' + encodeURIComponent('from=qianqian&version=2.1.0&method=baidu.ting.radio.getChannelSong&format=json&pn=0&rn=199&channelname=' + cname))
        return data
    },
    async suggestions(title){
        let iq = encodeURIComponent(`from=qianqian&version=2.1.0&method=baidu.ting.search.catalogSug&format=json&query=${title}`)
        return await this.fetchData(`${this.baseUrl}getAll?query=${iq}`)
    }
}