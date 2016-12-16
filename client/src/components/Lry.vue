<template>
    <div class="mb-layout-bd column3" id="lrcCol">
        <div class="album-wrapper">
            <a target="_blank" class="log" href="">
                <img width="180" height="180" src="">
            </a>
            <div class="album-name">
                <a target="_blank" class="log" href="">《》</a>
                <span class="icon"></span>
            </div>
        </div>

        <div class="lrc-wrapper ui-lrc ui-lrc-vertical lrc" id="lrcWrap" style="bottom: 50px;">
            <div class="no-lrc">
                <div></div>
                <span class="no-lrc-hint">该歌曲暂时没有歌词<a href="javascript:;" style="display:none;" id="requestLrc">求歌词</a>
                </span>
                <span class="send-lrc-request" style="display:none;">已经告诉ta啦</span>
            </div>
            <ul>
                <li>当前时间{{currentTime}}</li>
                <li v-for="item in lryArr" :item="item" :class="currentTime > item[0]? 'aa':'bb'">
                    {{item[1]}}
                </li>
            </ul>
        </div>

        <div class="ui-resizable" id="lrcResize">
            <div class="resizable-icon" id="widResize"></div>
        </div>
    </div>
</template>

<script>
    import apiProxy from '../apiProxy'
    export default {
        name:'lry',
        props:['playingId','currentTime'],
        data(){
            return{
                lryArr:[],
                title:''
            }
        },
        watch:{
            currentTime(to,from){   
                          
            },
            async playingId(to,from){
                let lryObj = await apiProxy.lry(to) 
                this.title =  lryObj.title
                this.lryArr = lryObj.lrcContent.split('\n').map(v=>v.split(/\]/g).map((l,i)=>{
                    return (i == 0 ? l.replace('[','') :l) /* ["00:00.33","海阔天空"] */
                })).map((v,index)=>{
                    v[0] = v[0].split(':').reduce((pre,cur,i)=>{
                       return  (~~pre)*60 + +cur
                    })
                    return v
                })
                window.xxx = this.lryArr           
            }
        }       
    }

</script>

<style>
    .column3 {
        right:5px
    }
</style>
