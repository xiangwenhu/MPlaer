<template>
    <div class="ui-widget-content ui-reelList-row emptyHeart even" reellist-row="0" style="top: 0px;">
        <div class="ui-reelList-cell  c0">
            <div class="ui-reelList-checkbox">
                <span></span>
            </div>
            <span class="listening-icon"></span>
            <span class="similar-icon cur-similar"></span>
            <span class="ui-reelList-songname">
                <span class="songname-txt">{{song.title}}</span>
            </span>
        </div>
        <div class="ui-reelList-cell  c1">
            <a class="a-link">{{song.artist}}</a>
        </div>
        <div class="ui-reelList-cell  c2">《<a class="a-link">{{song.album}}</a>》</div>
        <div class="ui-reelList-cell heartColumn c3">
            <div class="playlist-heart"> </div>
        </div>
    </div>

    <div class="ui-reelList-viewport">
        <div class="ui-reelList-canvas">

        </div>
    </div>
</template>

<script>
    export default {
        name:'song',
        props:['song']        
    }
</script>