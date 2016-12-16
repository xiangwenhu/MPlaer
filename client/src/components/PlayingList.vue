<template>
    <div>
        <div class="list list-temp ui-droppable playing" id="list_temp">
            <a class="icon column1-icon list-temp-icon" hidefocus="true"></a>
            <a class="text">收藏列表</a>
            <a class="column1-icon listening-icon listen-icon-playing" hidefocus="true"></a>
        </div>
        <div class="playingList">
            <ul @click="changeId">
                <li class="ui-lrc-sentence ui-lrc-prev" v-for="item in list" :key="item.songid" :data-id="item.songid" @mouseenter.stop="msenter" @mouseleave.stop="msleave">
                    <a :class="['text', item.songid == pid ? 'playingItem' : '']" :data-id="item.songid">{{item.songname}}</a>
                    <a :class="['song-item','hide']" @click.stop="removeSong" :data-id="item.songid" href="javascript:void(0)">x</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import store from '../store/store'
    export default {
        name:'playing-list',
        props:["pid"],
        data(){
            return {
               'list': store.cache.playingList               
            }
        },       
        methods:{
            changeId:function(ev){
                let el = ev.target               
                if(el.getAttribute("data-id") != null){
                    this.$emit('changePlayId',el.getAttribute("data-id"))
                }
            },
            removeSong(ev){
                let el = ev.target
                if(el.getAttribute('data-id') != null){
                    store.removeSong(el.getAttribute('data-id'))
                }
            },
            msenter(ev){
                let classList = ev.currentTarget.querySelector('.song-item').classList
                classList.add('show')
                classList.remove('hide')
            },
            msleave(ev){
                let classList = ev.currentTarget.querySelector('.song-item').classList
                classList.add('hide')
                classList.remove('show')
            }
        },
        computed:{
            pclass(){
                return 
            }
        }

    }
</script>

<style>
    .playingList li {
        color: rgba(41, 79, 52, 0.6);
        margin: 0 0 0 30px;
    }
    
    .playingList .text {
        color: inherit
    }
    
    .playingItem {
        background-color: rgba(68, 141, 119, 0.24);
    }

    .playingList .song-item{
        float: right;
        position: absolute;
        right: 30px;
    }

    .hide{
        display: none
    }

    .show{
        display: 'inline-block'
    }

</style>