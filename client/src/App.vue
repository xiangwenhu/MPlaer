<template>
    <div>   
       {{title}}
       <search-box></search-box>
       <player></player>

    </div>
</template>

<script>    
    import SearchBox from './components/SearchBox.vue'
    import Player from './components/Player.vue'
    export default {
        name:'appp',

        components:{
            SearchBox,
            Player
        },
        
        data(){
            return {
                title:'轻量的音乐盒子'
            }
        }
    }
</script>
