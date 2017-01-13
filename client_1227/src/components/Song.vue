<template>
    <div :class="classList" reellist-row="0" style="top: 0px;">
        <div class="ui-reelList-cell  c0" >
            <div class="ui-reelList-checkbox" @click.stop="checkSong">
                <span></span>
            </div>
            <span class="listening-icon"></span>
            <span class="similar-icon cur-similar"></span>
            <span class="ui-reelList-songname">
                <span class="songname-txt">{{song.songname}}</span>
            </span>
        </div>
        <div class="ui-reelList-cell  c1">
            <a class="a-link">{{song.artistname}}</a>
        </div>
        <div class="ui-reelList-cell  c2">《<a class="a-link">{{song.album}}</a>》</div>
        <div class="ui-reelList-cell  c3" style="width:auto"><span :data-id="song.songid" @click.stop="addSong">+</span><span :data-id="song.songid" @click.stop="changePlayingId" >>></span></div>
    </div>

    <div class="ui-reelList-viewport">
        <div class="ui-reelList-canvas">

        </div>
    </div>
</template>

<script>


    export default {
        name:'song',
        props:['song','allChecked'],
        data(){
            return {
                isChecked:false
            }
        },
        methods:{
            addSong:function(){
                this.$store.commit('addSong',this.song)
            },
            changePlayingId:function(){
                this.$store.dispatch('changeId',this.song.songid)
            },
            checkSong:function(){
                this.isChecked = !this.isChecked
                this.$store.commit('markSong',{
                    isAdd:this.isChecked,
                    song:this.song
                })
            }           
        },
        computed:{
            classList(){
                return 'ui-widget-content ui-reelList-row emptyHeart even ' + (this.isChecked ?  'ui-reelList-checked' :'')
            }
        },
        watch:{
            allChecked(to){
                this.isChecked = this.allChecked
                this.$store.commit('markSong',{
                    isAdd:this.isChecked,
                    song:this.song
                })
            }
        }              
    }
</script>

<style>
    .ui-reelList-cell{
        position:relative;
        display: inline-block;
        width: 26%;
    }
</style>