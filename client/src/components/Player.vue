<template>
    <div class="mb-layout-ft minwidth" onselectstart="return false;" alog-alias="mbox-play-ctrl" monkey="mbox-play-ctrl">
        <div class="panel" id="playPanel">
            <div class="panel-inner">
                <div class="left-panel" id="leftPanel">
                    <ul class="play-btn">
                        <li class="prev" @click="pre">
                            <a class="wg-button" hidefocus="true" title="上一首[←]">
                                <span class="wg-button-inner"></span>
                            </a>
                        </li>
                        <li :class="['play wg-button',paused ? 'stop':'']" title="暂停" @click="outerPlay">
                            <span class="wg-button-inner">
                            <a class="" hidefocus="true"></a>
                        </span></li>
                        <li class="next" @click="next">
                            <a class="wg-button" hidefocus="true" title="下一首[→]">
                                <span class="wg-button-inner"></span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="main-panel">
                    <div class="pane">
                        <audio volume="-1" id="player" controls :data-id="playingId" @timeupdate="timeupdate" @ended="ended" @pause="togglePlay" @play="togglePlay"> </audio>
                    </div>
                </div>
                <div class="right-panel">
                    <a href="javascript:;" id="switchFm" class="switch-fm-btn" title="随便听听" @click="listenHearts">
                        <i class="icon-ting"></i>
                        <span>随心听</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import apiProxy from '../apiProxy'
    import store from '../store/store'      

    export default {
        name:'player',      
        data(){
            return {
                url:null,
                paused:true               
            }
        },
        computed:{
            songId(){
                return this.playingId
            }                      
        },
        methods:
        {
            ended:function(){
                console.log('ended song')
                this.$emit('playNextSong')
            }, 
            pre:function(){
                this.$emit('playPreSong')
            },
            next:function(){
                this.$emit('playNextSong')
            },
            togglePlay:function(){               
                this.paused = player.paused                
            },
            timeupdate:function(ev){
                this.$emit('timeupdate',player.currentTime)
            },
            outerPlay:function(){ 
                if(!this.playingId){
                    return
                }            
                player.paused? player.play():player.pause()
                this.paused = player.paused 
            },
            listenHearts: function(){
                this.$emit('toHearts')                      
            }
        },
        watch:{
            async songId(to,from){
                console.log('player got new songid:' + to)
                if(to !== from){
                    let detail = await apiProxy.songDetail(to)
                    this.$emit('songDetail',detail)
                    player.src = '/api/song?fileLink=' + detail.bitrate['file_link']     
                    if(player.volume < 0){
                        player.volume = 0.5
                    }              
                    player.play()
                }
            }
        },
        mounted:function(){
            setTimeout( async()=>{
                let channels = await apiProxy.channels()
                store.state.channels = channels.result[0].channellist
            },15)
        }

    }
</script>

<style>
    #player {       
        width: 100%
    }
    
    .mb-layout-ft {
        text-align: left;
    }
    
    .left-panel {
        position: absolute;
        left: 0;
        top: 0;
    }
    
    .main-panel {
        width: auto;
        margin: 22px 150px
    }
    
    .right-panel {
        position: absolute;
        width: 120px;
        top: 22px;
        right: 0;
    }
</style>