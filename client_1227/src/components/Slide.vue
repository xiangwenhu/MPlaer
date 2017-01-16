<template>
    <div class="fm-player">
        <div class="fm-album">
            <a href="javascript:;" target="_blank" hidefocus="true" title="播放[空格键]" class="play stop">
                <img src="http://musicdata.baidu.com/data2/pic/89086641/89086641.jpg@s_0,w_300" width="240" height="240" style="display: block;">
            </a>
            <div class="mask" style="display: block;"></div>
            <a href="javascript:;" title="播放[空格键]" class="mask-text" style="display: inline;" @click="play">点击播放</a>
        </div>
        <div class="fm-songinfo">
            <p class="fm-song-title">
                <a target="_blank" title="item.title" href="http://music.baidu.com/song/13744545?pst=mbox_fm">{{item.title}}</a>
            </p>
            <p class="fm-artist-name">
                作词：<a target="_blank"  href=""></a> 作曲：<a target="_blank"  href=""></a> 
            </p>
            <p class="fm-album-name">
                专辑：<a target="_blank" title="" href="http://music.baidu.com/album/13744553?pst=mbox_fm"></a>
            </p>
            <p class="fm-artist-name" target="">
                演唱：<a target="_blank" :title="item.artist" href="http://music.baidu.com/artist/1380?pst=mbox_fm">{{item.artist}}</a>
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

    
    export default {
        name:'slide',
        props:['item'],
        methods:{
            play:function(){
                this.item && this.$store.dispatch('changeId',this.item.songid)
            },
            next:function(){
                this.$store.dispatch('next')
            }
        }
    }


</script>

