<template>
    <div class="mb-layout-hd cmb-comm" alog-alias="mbox-header" monkey="mbox-header">
        <div class="top-banner">
            <div id="searchBar" style="left:556px">
                <div action="search">
                    <span class="ui-watermark-container ui-watermark-input">                        
                        <input @blur="delayHiddenSuggestions" @focus="getSuggestions"  @input="getSuggestions"  @keyup.enter="search" v-model="keyWords" type="text" placeholder="输入歌曲、歌手、专辑名" size="24" class="sug-input" autocomplete="off" name="key" id="search-sug-input">
                    </span>
                    <input type="button" id="search-sug-submit" value="" @click="search">
                    <div @mouseenter="clearHiddenSuggestions" v-show="displaySuggestions && suggestions.length > 0" class="sug-result" @mouseleave="delayHiddenSuggestions">
                        <p class="sug-source sug-quku">曲库搜索</p>
                        <dl class="sug-song clearfix">
                            <dt class="sug-title clearfix">歌曲</dt>
                            
                            <dd class="first-item" v-for='sugg in suggestions' v-if="!!sugg">
                                <div class="sug-item">
                                    <a :data-id="sugg.songid" :href="'http://music.baidu.com/song/' + sugg.songid  + '?fr=ps||www.baidu.com'" class="sug-song-detail"
                                        target="_blank"><span class="songname">{{sugg.songname}}</span><span class="artistname"><i class="h-line">-</i>{{sugg.artistname}}</span></a>
                                </div>
                                <div class="item-op sug-quku-op" data-type="song">
                                    <a :data-id="sugg.songid" class="sug-play-btn" @click="playSong"><span></span></a>
                                    <span class="separtor"></span>
                                    <a :data-id="sugg.songid" :data-name="sugg.songname" class="sug-add-btn" @click="addSong"><span></span></a>
                                    <span class="separtor"></span>
                                </div>
                            </dd>

                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

    import { mapState } from 'vuex'

    export default {
        name: 'search-box',  
        data(){
            return {
                displaySuggestions: false,
                ticket : null
            }
        },
        computed: {
            suggestions(){
                return (this.$store.state.suggestions && this.$store.state.suggestions.song) || [] 
            }
        }, 
        methods: {
            search: async function (ev) {    
                this.clearHiddenSuggestions()          
                this.keyWords && this.$store.dispatch('searchAsync', this.keyWords)               
            },
            getSuggestions: async function(){
                this.clearHiddenSuggestions()
                if(this.keyWords){
                    this.displaySuggestions = false
                    this.$store.dispatch('suggestions',this.keyWords)
                }
            },
            playSong(ev){               
                this.$store.dispatch('changeId',ev.currentTarget.getAttribute('data-id'))                
            },
            addSong(ev){
                this.$store.commit('addSong',{
                    songid:ev.currentTarget.getAttribute('data-id'),
                    songname:ev.currentTarget.getAttribute('data-name')
                })
            },
            hiddenSuggestions(){
                this.displaySuggestions = false
            },
            delayHiddenSuggestions(){
               this.ticket =  setTimeout(()=>this.hiddenSuggestions(),500)
            },
            clearHiddenSuggestions(){
                if(this.ticket){
                    clearTimeout(this.ticket)
                    this.ticket = null
                }
            }            
        },
        watch:{
            suggestions(to,from){
                if(to && to.length > 0){
                    this.displaySuggestions = true
                }
            }    
        }

    }
</script>

<style>
    #searchBar{
        left: 20% !important
    }

    .sug-result{
        display: block
    }
</style>