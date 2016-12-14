<template>
    <div class="default-main" id="mainContent">
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
            <div class="ui-reelList-header-column c3">
                <div class="sort-item" data-sortkey="heartCol"></div>
            </div>
        </div>
        <song v-for="item in songs" :key="item.id" :song="item">
        </song>
    </div>
</template>




<script>
    import Song from './Song.vue'
    export default {
        name:'song-list',
        components:{
            Song
        },
        data(){
             return {
                loading: false,  
                songs:[{
                   title:'海阔天空',
                   artist:'beyond',
                   album:'海阔天空',
                }]            
            }
        }
    }

</script>