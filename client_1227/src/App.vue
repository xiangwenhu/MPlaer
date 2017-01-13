<template>
  <div>
    <div class="header">
      <div class="inner">     
        <router-link to="/index">播放器</router-link>
        <router-link to="/cinema">影院</router-link> 
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<style>

.header{
    background-color: #ff6600;
    position: fixed;
    z-index: 999;
    height: 45px;
    top: 0;
    width: 200px;   
    right: 0;
}
.header .inner {
    max-width: '800px';
    box-sizing: 'border-box';
    margin: 0px auto;
    padding: 15px 5px;
}

.header a {      
    color: rgba(255, 255, 255, .8);
    line-height: 24px;
    transition: color .15s ease;
    display: inline-block;
    vertical-align: middle;
    font-weight: 300;
    letter-spacing: .075em;
    margin-right: 1.8em;   
    font-size: 15px
}
.header a:hover{    
    color: #fff   
}
</style>