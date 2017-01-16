<template>
    <div>
        <div>
            <a class="next-page pre-page" href="javascript:;" title="" @click="pre">
                <i class="arrow velocity-animating"></i>
            </a>
        </div>
        <div id="slides">
            <slide v-for="(item,index) in items" :key="item.id" :item="item">
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
                currentIndex: 0,
                items:[]
            }
        },
        components: {
            Slide
        },
        computed: mapState(['hearts']),
        methods: {
            pre:function(){
                this.currentIndex >= 1   &&  this.currentIndex--               
            },
            next:function(){
                this.currentIndex < this.hearts.length && this.currentIndex++
            }       
        },
        mounted:function(){
            this.items = (this.hearts || []).slice(0,5)
        },
        watch:{
            currentIndex(to,from){
                if(to < 2){
                    this.items = this.hearts.slice(to,to + 5)
                }else if (to >= this.hearts.length -2 ){
                    this.items = this.hearts.slice(this.hearts.length-5,this.hearts.length)
                }else {
                    this.items = this.hearts.slice(to-2,to+3)
                }
            },
            hearts(to,from){
                this.items =  (this.hearts || []).slice(0,5)
            }
        }
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