<template>
    <div class="mb-layout-hd cmb-comm" alog-alias="mbox-header" monkey="mbox-header">
        <div class="top-banner">
            <div id="searchBar" style="left:556px">
                <div action="search">
                    <span class="ui-watermark-container ui-watermark-input">                        
                        <input type="text" placeholder="输入歌曲、歌手、专辑名" size="24" class="sug-input" autocomplete="off" name="key" id="search-sug-input">
                    </span>
                    <input type="submit" id="search-sug-submit" value="">
                    <div class="sug-result" style="display: none;">
                        <p class="sug-source sug-quku">曲库搜索</p>
                        <dl class="sug-artist clearfix">
                            <dt class="sug-title clearfix">歌手</dt>
                        </dl>
                        <dl class="sug-song clearfix">
                            <dt class="sug-title clearfix">歌曲</dt>
                        </dl>
                        <dl class="sug-album clearfix">
                            <dt class="sug-title clearfix">专辑</dt>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'search-box',  
  data () {
    return {     
    }
  },
  computed: {   
  },
  methods: {   
  }
}
</script>