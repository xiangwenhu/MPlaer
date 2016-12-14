<template>
    <div>   
       {{title}}
       <search-box></search-box>

       <song-list></song-list>

       <player></player>

    </div>
</template>

<script>    
    import SearchBox from './components/SearchBox.vue'
    import Player from './components/Player.vue'
    import SongList from './components/SongList.vue'
    export default {
        name:'appp',

        components:{
            SearchBox,
            Player,
            SongList
        },
        
        data(){
            return {
                title:'轻量的音乐盒子'
            }
        }
    }
</script>
