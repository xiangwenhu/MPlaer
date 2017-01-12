<template>
    <div>
        <search-box></search-box>

        <div class="default-main" id="mainContent">
            <div class="main-wrapper">
                <div class="mb-layout-bd column1" id="leftCol">
                    <div class="leftbar-bottom-bg">
                        <div class="leftbar-outer">
                            <div class="leftbar">
                                <playing-list v-on:changePlayId="changePlayId" :pid="playingId"></playing-list>
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

        <player :playingId="playingId" v-on:toHearts ="toHearts" v-on:timeupdate="updatetime" v-on:songDetail='detail' v-on:playNextSong="nextSong" v-on:playPreSong="preSong"></player>
    </div>
</template>

<script>    
    import SearchBox from './components/SearchBox.vue'
    import Player from './components/Player.vue'
    import SongList from './components/SongList.vue'
    import PlayingList from './components/PlayingList.vue'
    import Lry from './components/Lry.vue'


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
            }
        },
        methods:{
            changePlayId:function(id){  /* 修改播放音乐的id */

            },
            nextSong:function(){               

            },
            updatetime:function(ct){
              
            },
            detail:function(d){
           
            },
            toHearts: async function(){

            }
        },
        mounted:function(){      
                   
        } 
    }
</script>

<style>
    .column2 {
        right: 280px
    }
</style>