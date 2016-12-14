<template>
    <div class="mb-layout-ft minwidth" onselectstart="return false;" alog-alias="mbox-play-ctrl" monkey="mbox-play-ctrl">
        <div class="panel" id="playPanel">
            <div class="panel-inner">
                <div class="left-panel" id="leftPanel">
                    <ul class="play-btn">
                        <li class="prev">
                            <a class="wg-button" hidefocus="true" title="上一首[←]"><span class="wg-button-inner"></span></a>
                        </li>
                        <li class="play wg-button" title="暂停"><span class="wg-button-inner">
                            <a class="" hidefocus="true"></a>
                        </span></li>
                        <li class="next">
                            <a class="wg-button" hidefocus="true" title="下一首[→]"><span class="wg-button-inner"></span></a>
                        </li>
                    </ul>
                </div>                
                <div class="right-panel">
                    <div class="playmod" id="playMode">
                        <span class="list-mode" title="顺序播放"></span>
                    </div>

                    <div class="volume" id="volumeWrap">
                        <a class="mute wg-button" hidefocus="true" title="静音"><span class="wg-button-inner"></span></a>
                        <div class="vol-slider-wrapper">
                            <div id="volSlider" class="vol-slider ui-slider ui-slider-horizontal ui-widget ui-widget-content ui-corner-all">
                                <div class="ui-slider-range ui-widget-header ui-slider-range-min" style="width: 86%;"><span class="ui-slider-range-inner"></span></div><a class="ui-slider-handle ui-state-default ui-corner-all"
                                    hidefocus="true" style="left: 86%;"><span></span></a></div>
                        </div>
                    </div>
                    <div class="hq" id="hq">
                        <div class="hq-switch" id="hqSwitch">
                            <i class="icon vip-gold-new"></i>
                            <span class="hq-desc">选择音质</span>
                        </div>
                        <div class="hq-switch-loading"></div>
                    </div>
                </div>
                <div class="main-panel">
                    <div class="pane">
                        <audio id="player" controls> </audio>
                    </div>
                </div>
            </div>
        </div>

        <div class="switch-fm-btn-wrapper">
            <a href="javascript:;" id="switchFm" class="switch-fm-btn" title="随便听听">
                <i class="icon-ting"></i>
                <span>随心听</span>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name:'player'
    }

</script>