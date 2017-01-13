<template>
    <div>
        <div class="list list-temp ui-droppable playing" id="list_temp">
            <a class="icon column1-icon list-temp-icon" hidefocus="true"></a>
            <a class="text">收藏列表</a>
            <a class="column1-icon listening-icon listen-icon-playing" hidefocus="true"></a>
        </div>
        <div class="playingList">
            <ul @click="changePlayingId">
                <li class="ui-lrc-sentence ui-lrc-prev" v-for="item in list" :key="item.songid" :data-id="item.songid" @mouseenter.stop="msenter" @mouseleave.stop="msleave">
                    <a :class="['text', item.songid == pid ? 'playingItem' : '']" :data-id="item.songid">{{item.songname}}</a>
                    <a :class="['song-item','hide']" @click.stop="removeSong" :data-id="item.songid" href="javascript:void(0)">x</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script> 

    import {mapState,mapMutations} from 'vuex'
    export default {
        name:'playing-list',             
        methods:{
            changePlayingId:function(ev){
                let el = ev.target               
                if(el.getAttribute("data-id") != null){
                    this.$store.dispatch('changeId',el.getAttribute("data-id"))
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
            },
            removeSong:function(ev){
                let el = ev.target
                if(el.getAttribute('data-id') != null){
                   this.$store.commit('removeSong',el.getAttribute('data-id'))
                }
            }
        },
        computed:mapState({
            pid: state=>state.playingId,
            list: state => state.favorites
        }),  

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