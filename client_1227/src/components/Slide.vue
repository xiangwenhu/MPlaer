<template>
    <div :class='["fm-player",playingId == item.songid ? "playing":""]'>
        <div class="fm-album">
            <a href="javascript:;" target="_blank" hidefocus="true" title="播放[空格键]" class="play stop">
                <img :src='songinfo.pic_big?songinfo.pic_big:""' width="240" height="240" style="display: block;" title="" />
            </a>
            <div class="mask" style="display: block;"></div>
            <a href="javascript:;" title="" class="mask-text" style="display: inline;" @click="play">{{ playingId == item.songid ?"" :"点击播放"}}</a>
        </div>
        <div class="fm-songinfo">
            <p class="fm-song-title">
                <a target="_blank" title="item.title" href="javascript:void()">{{item.title}}</a>
            </p>
            <p class="fm-album-name">
                专辑：<a target="_blank" title="" :href='songinfo.album_id ? "http://music.baidu.com/album/" + songinfo.album_id:""'>{{songinfo.album_title}}</a>
            </p>
            <p class="fm-artist-name" target="">
                演唱：<a target="_blank" :title="item.artist" :href='songinfo.ting_uid ? "http://music.baidu.com/artist/" + songinfo.ting_uid:""'>{{item.artist}}</a>
            </p>
        </div>
        <div class="fm-play-panel">
            <ul>
                <li class="fm-play">
                    <a href="javascript:;" title="播放[空格键]" class="play stop" hidefocus="true" @click="play"></a>
                </li>
                <li class="fm-next">
                    <a href="javascript:;" title="下一首[→]" hidefocus="true" @click.stop="next"></a>
                </li>
                <li class="fm-trashcan">
                    <a href="javascript:;" title="垃圾桶" hidefocus="true"></a>
                </li>
            </ul>
        </div>

    </div>
</template>


<script>

    import apiProxy from '../store/apiProxy'
    import { mapState } from 'vuex'

    export default {
        name: 'slide',
        props: ['item'],
        data() {
            return {
                songinfo: {}
            }
        },
        computed: mapState(['playingId']),
        methods: {
            play: function () {
                if(this.playingId != this.item.songid){
                    this.item && this.$store.dispatch('changeId', this.item.songid)
                }
            },
            next: function () {
                this.$store.dispatch('next')
            }
        },
        updated: async function () {      
            try {
                if( !this.songinfo.song_id || (this.songinfo.song_id && this.item.songid != this.songinfo.song_id) ){                   
                    let detail = await apiProxy.songDetail(this.item.songid)
                    this.songinfo = detail.songinfo
                }
            }catch(err){
                
            }
        },
        mounted: async function () {      
            try {                               
                let detail = await apiProxy.songDetail(this.item.songid)
                this.songinfo = detail.songinfo               
            }catch(err){
                
            }
        }
    }


</script>


<style>
    .fm-songinfo .fm-album-name a,
    .fm-songinfo .fm-artist-name a {
        margin-left: 0.5em
    }

    .playing{
        background-color: rgba(194, 230, 75, 0.79)
    }
</style>