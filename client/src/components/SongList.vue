<template>
    <div id="page-song" class="tab-page reelList_922366 ui-reelList ui-widget ui-tabs-panel ui-widget-content ui-corner-bottom fullHeartShow list-temp">
        <div class="ui-reelList-header ui-state-default" style="overflow: hidden;">
            <div class="ui-reelList-header-column c0" style="overflow: hidden;">
                <div class="ui-reelList-checkbox"></div>
                <div class="sort-item" data-sortkey="songName">歌曲<span class="sort-arrow-icon" style="display: inline;"></span>
                    <ul class="ui-reelList-sort-box" style="display: none;">
                        <li data-sortmethod="default" class="select">默认</li>
                        <li data-sortmethod="increase">歌曲升序</li>
                        <li data-sortmethod="decrease" class="">歌曲降序</li>
                    </ul>
                </div>
            </div>
            <div class="ui-reelList-header-column c1" style="overflow: hidden;">
                <div class="sort-item" data-sortkey="artistName">歌手<span class="sort-arrow-icon" style="display: inline;"></span>
                    <ul class="ui-reelList-sort-box" style="display: none;">
                        <li data-sortmethod="default" class="select">默认</li>
                        <li data-sortmethod="increase" class="">歌手升序</li>
                        <li data-sortmethod="decrease">歌手降序</li>
                    </ul>
                </div>
            </div>
            <div class="ui-reelList-header-column c2" style="overflow: hidden;">
                <div class="sort-item" data-sortkey="albumName">专辑<span class="sort-arrow-icon" style="display: inline;"></span>
                    <ul class="ui-reelList-sort-box" style="display: none;">
                        <li data-sortmethod="default" class="select">默认</li>
                        <li data-sortmethod="increase">专辑升序</li>
                        <li data-sortmethod="decrease">专辑降序</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="ui-reelList-viewport">
            <div v-if="songs.length > 0" class="ui-reelList-canvas" @click="changeId">
                <song v-for="item in songs" :key="item.id" :song="item">
                </song>
            </div>
            <div v-else style="text-align: center;margin:20px 0">
                <div class="text">没有数据</div>
            </div>
        </div>
    </div>
</template>




<script>
    import Song from './Song.vue'
    import store from '../store/store'

    console.log(store.state.songs)

    export default {
        name:'song-list',
        components:{
            Song
        },
        data(){
            return{
                songs: store.state.songs
            }
        },
        methods:{
            changeId:function(ev){
                let el = ev.target
                if(el.getAttribute("data-id") != null){
                    this.$emit('changePlayId',el.getAttribute("data-id"))
                }
            }
        }        
    }

</script>

<style>
    .ui-reelList-header-column{
        position:relative;
        display: inline-block;
        width: 26%;
    }
    .ui-reelList-cell , .ui-reelList-header-column {
        padding: 0
    }
    .ui-reelList-row{
        position: relative
    }

</style>