<template>
    <div id="fm-panel">
        <div class="flex-top">top</div>
        <div class="flex-middle">
            <div>
                <a class="next-page" href="javascript:;" title="">
                    <i class="arrow velocity-animating"></i>
                </a>
            </div>
            <div>
                <slide></slide>
            </div>
            <div>
                <a class="next-page" href="javascript:;" title="">
                    <i class="arrow velocity-animating"></i>
                </a>
            </div>
        </div>
        <div class="flex-bottom">bottom</div>
    </div>
</template>






<script>

    import Slide from './components/Slide.vue'

    export default {
        name:'cinima',
        components:{Slide},
        methods:{

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
    
    #fm-panel .flex-middle {
        flex: 2
    }
</style>