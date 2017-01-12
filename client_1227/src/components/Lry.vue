<template>
    <div class="mb-layout-bd column3" id="lrcCol">
        <div class="album-wrapper">
            <a target="_blank" class="log" href="">
                <img width="180" height="180" :src="songDetails ? songDetails.songinfo.pic_big :'//mu9.bdstatic.com/player/static/css/image-32/default_album.jpg'">
            </a>
            <div class="album-name">
                <a target="_blank" class="log" href="javascript:void(0)">{{songDetails? songDetails.songinfo.author:''}}</a>
                <span class="icon"></span>
            </div>
        </div>

        <div class="lrc-wrapper ui-lrc ui-lrc-vertical lrc" id="lrcWrap" style="bottom: 50px;">

            <ul v-if="(lryArr||[]).length>0">                          
                <li v-for="(item,index) in lryArr" :item="item" :class="currentIndex == index ? 'light':''" :data-index="'index-' + index">
                    {{item.length > 1 ? item[1]: item[0]}}
                </li>
            </ul>
            <div v-else class="no-lrc">
                <div></div>
                <span class="no-lrc-hint">该歌曲暂时没有歌词<a href="javascript:;" id="requestLrc">求歌词</a>
                </span>
                <span class="send-lrc-request">已经告诉ta啦</span>
            </div>
        </div>

        <div class="ui-resizable" id="lrcResize">
            <div class="resizable-icon" id="widResize"></div>
        </div>
    </div>
</template>

<script> 
    export default {
        name:'lry',
        props:['playingId','currentTime','songDetails'],
        data(){
            return{
                lryArr:[],
                title:'',              
                currentIndex:-1
            }
        },
        watch:{
         
        }       
    }

</script>

<style>
    .column3 {
        right:5px
    }
    .light{
        color:red;
        font-size: 15px;
    }
</style>
