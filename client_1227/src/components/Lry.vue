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
    import {mapState} from 'vuex'
    import apiProxy from '../store/apiProxy' 
    export default {
        name:'lry',      
        data(){
            return{
                lryArr:[],
                title:'',              
                currentIndex:-1
            }
        },
        computed:mapState([
            'currentTime',
            'playingId'           
        ]),
        watch:{
            currentTime(to,from){
             let i = this.lryArr.findIndex(v=>v[0]>to)   
                if(i<0){
                    return
                }
                if(!(i == 0 || i == this.lryArr.length - 1)){ /* 不是开头和结尾 */
                    i = i - 1
                }
                if(i != this.currentIndex ){                              
                    this.currentIndex = i   
                    let cEl = lrcWrap.querySelector('[data-index="index-' + i + '"]');
                    if(cEl !=null){ 
                        let offsetHeight = lrcWrap.offsetHeight,
                            offsetTop = cEl.offsetTop 
                        lrcWrap.scrollTop = offsetTop > offsetHeight ? offsetTop - offsetHeight/2.0 : offsetTop/2.0
                    }
                }                 
            },
            async playingId(to){
                lrcWrap.scrollTop = 0
                let lryObj = await apiProxy.lry(to) 
                this.title =  lryObj.title
                /* 歌词单独使用，不托管store */
                this.lryArr = lryObj.lrcContent.split('\n').map(v=>v.split(/\]/g).map((l,i)=>{
                    return (i == 0 ? l.replace('[','') :l) /* ["00:00.33","海阔天空"] */
                })).map((v,index)=>{
                    /*  有的没有歌词进度信息 */
                    if(v.length > 1){
                        v[0] = v[0].split(':').reduce((pre,cur,i)=>{
                            return  (~~pre)*60 + +cur
                        })                        
                    }
                    return v
                })          
            }
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
