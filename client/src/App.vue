<template>
    <div>
        <search-box></search-box>

        <div class="default-main" id="mainContent">
            <div class="main-wrapper">
                <div class="mb-layout-bd column1" id="leftCol">
                    <div class="leftbar-bottom-bg">
                        <div class="leftbar-outer">
                            <div class="leftbar">
                                <playing-list  v-on:changePlayId="changePlayId" :pid="playingId"></playing-list>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-layout-bd column2">
                    <div class="tab-main ui-tabs ui-widget ui-widget-content ui-corner-all" id="tab">
                        <div class="tab-content cfix">
                            <song-list v-on:changePlayId="changePlayId"></song-list>
                        </div>
                    </div>
                </div>
                <lry :playingId="playingId" :currentTime='currentTime' v-ref="lryC" :songDetails="songDetails"></lry>
            </div>            
        </div>

        <player :playingId="playingId" v-on:timeupdate ="updatetime" v-on:songDetail='detail'  v-on:playNextSong="nextSong" v-on:playPreSong="preSong"></player>
    </div>
</template>

<script>    
    import SearchBox from './components/SearchBox.vue'
    import Player from './components/Player.vue'
    import SongList from './components/SongList.vue'
    import PlayingList from './components/PlayingList.vue'
    import Lry from './components/Lry.vue'
    import store from './store/store'

    export default {
        name:'appp',

        components:{
            SearchBox,
            Player,
            SongList,
            PlayingList,
            Lry
        },
        
        data(){
            return {
                playingId:null,   /* 正在播放的歌曲id */
                currentTime:-1,
                songDetails:null
            }
        },
        methods:{
            changePlayId:function(id){  /* 修改播放音乐的id */
                this.playingId = id
                console.log('song id changed to:' + id)
            },
            nextSong:function(){
               let index = store.cache.playingList.findIndex(p=>{
                   return p.songid == this.playingId
               });               
               if(index >=0){
                   /* 是不是最后一首歌曲 */
                   this.playingId =  (index == store.cache.playingList.length - 1) ? store.cache.playingList[0].songid:store.cache.playingList[index+1].songid
               }else{
                   this.playingId = store.cache.playingList[0].songid
               }
            },
            preSong:function(){
              let index = store.cache.playingList.findIndex(p=>{
                   return p.songid == this.playingId
               });               
               if(index >=0){
                   /* 是不是第一首歌曲 */
                   let len = store.cache.playingList.length
                   this.playingId =  (index == 0) ? store.cache.playingList[len-1].songid:store.cache.playingList[index-1].songid
               }else{
                    this.playingId = store.cache.playingList[0].songid
               }
            },
            updatetime:function(ct){
                this.currentTime = ct
            },
            detail:function(d){
                this.songDetails = d
            }
        },
        mounted:function(){
            setTimeout(()=>{
                this.playingId =  store.cache.playingList[0].songid                                
            },10)           
        } 
    }
</script>

<style>
    .column2 {
        right: 280px
    }
</style>