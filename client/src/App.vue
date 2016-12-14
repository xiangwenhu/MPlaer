<template>
    <div>
       <search-box></search-box>

       <div class="default-main" id="mainContent">
           <div class="main-wrapper">
               <div class="mb-layout-bd column2">
                    <div class="tab-main ui-tabs ui-widget ui-widget-content ui-corner-all" id="tab">
                        <div class="tab-content cfix">
                            <song-list></song-list>
                        </div>
                    </div>                    
               </div>
           </div>

       </div>
       

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

<style>
    .column2{
        right:190px
    }
</style>
