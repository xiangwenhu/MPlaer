<template>
    <div class="mb-layout-bd column3" id="lrcCol">
        <div class="album-wrapper">
            <a target="_blank" class="log" href="http://music.baidu.com/album/197988?pst=musicalbumd_play&amp;fr=altg8">
                <img width="180" height="180" src="http://musicdata.baidu.com/data2/pic/09c2c48f280af5f6f97afa57a96c83d0/261986226/261986226.jpg">
            </a>
            <div class="album-name">
                <a target="_blank" class="log" href="http://music.baidu.com/album/197988?pst=musicalbumd_play&amp;fr=altg8">《Deliberate 犹豫》</a>
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
    <li class="ui-lrc-sentence ui-lrc-prev">不再犹豫</li>
    <li class="ui-lrc-sentence ui-lrc-prev">作词：小美 作曲：黄家驹</li>
    <li class="ui-lrc-sentence ui-lrc-prev">演唱：Beyond</li>
    <li class="ui-lrc-sentence ui-lrc-prev">&nbsp;</li>
    <li class="ui-lrc-sentence ui-lrc-prev">无聊望见了犹豫</li>   
    <li class="ui-lrc-sentence">终可见</li>
    <li class="ui-lrc-sentence">&nbsp;</li>
</ul>
</div>
<div class="link-wrapper">
    <div class="link-source" id="linkSource" style="height: 0px;"> 来源:
<a>http://yinyuesh...44ac8</a>
</div>


<div class="clipboard-wrapper">
    <a id="downloadLrc" class="clip-btn" target="_blank" href="http://musicdata.baidu.com/data2/lrc/13895697/13895697.lrc">下载歌词</a>
    <a id="errorLrc" class="clip-btn">歌曲信息报错</a>
</div>
</div>
<div class="ui-resizable" id="lrcResize">
    <div class="resizable-icon" id="widResize"></div>
</div>
</div>


</template>