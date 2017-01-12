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



    export default {
        name:'player',
        props:['playingId'],
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
              
            }, 
            pre:function(){
               
            },
            next:function(){
                
            },
            togglePlay:function(){               
              
            },
            timeupdate:function(ev){
               
            },
            outerPlay:function(){ 
             
            },
            listenHearts: function(){
                    
            }
        },
        watch:{
          
        },
        mounted:function(){
           
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