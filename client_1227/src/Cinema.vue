<template>
    <div id="fm-panel">
        <div class="flex-top">
            <h1>当前播放歌曲:{{ songDetail? songDetail.songinfo.title:'' }}</h1>
        </div>
        <div class="flex-middle">
            <Slides></Slides>
        </div>
        <div class="flex-bottom">
            <player></player>
        </div>
    </div>
</template>






<script>

    import Slides from './components/Slides.vue'
    import Player from './components/Player.vue'
    import { mapState } from 'vuex'

    export default {
        name: 'cinima',
        components: { Slides, Player },
        computed: mapState(['songDetail']),
        methods: {

        },
        beforeMount: function () {
            if (!this.$store.state.hearts || this.$store.state.hearts.length <= 0) {
                this.$store.dispatch('toHearts')
            } else {
                this.$store.commit('changeMode', 10)
                this.$store.dispatch('next')
            }
        }

    }



</script>

<style>
    #fm-panel {
        display: flex;
        position: relative;
        flex-flow: column;
        background: #FFF url(//mu6.bdstatic.com/cms/mbox/fm/night.jpg) repeat 0 0
    }
    
    #fm-panel .flex-top,
    #fm-panel .flex-bottom {
        flex: 1
    }

    #fm-panel .flex-top{
        color: #FFF;
        font-size:22px;
        margin-left: 35%;
        margin-top: 25;
    }
    
    #fm-panel .flex-middle {
        flex: 2
    }
</style>