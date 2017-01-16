<template>
    <div>
        <div>
            <a class="next-page pre-page" href="javascript:;" title="" @click="pre">
                <i class="arrow velocity-animating"></i>
            </a>
        </div>
        <div id="slides">
            <slide v-for="(item,index) in hearts" :key="item.id" :item="item" v-if="filterItems(index)">
            </slide>
        </div>
        <div>
            <a class="next-page" href="javascript:;" title="" @click="next">
                <i class="arrow velocity-animating"></i>
            </a>
        </div>
    </div>

</template>





<script>
    import Slide from './Slide.vue'
    import { mapState } from 'vuex'

    export default {
        name: 'slides',
        data() {
            return {
                currentIndex: 0
            }
        },
        components: {
            Slide
        },
        computed: mapState(['hearts']),
        methods: {
            pre: function () {
                this.currentIndex >= 1 && this.currentIndex--
            },
            next: function () {
                this.currentIndex < this.hearts.length && this.currentIndex++
            },
            /* 不太合理 */
            filterItems: function (index) {
                return (index - this.currentIndex >= 0 && index - this.currentIndex <= 4) || (index - this.currentIndex < 0 && index - this.currentIndex >= 4) 

            }
        },
    }




</script>



<style>

    .fm-player{
        position: relative;
        top:0;
        left:185px;
        display: inline-block;
        margin: 0 15px;
    }

    .fm-player .fm-play-panel{
        margin-top:50px
    }

    #fm-panel .next-page{
        margin-top:0;
        height: 90px;
        top:45%;
        transform: rotate(180deg)
    }

    #fm-panel .pre-page{
        left: 0;
        margin-top:0;
        height: 90px;
        top:45%;   
         transform: rotate(0deg)     
    }

</style>