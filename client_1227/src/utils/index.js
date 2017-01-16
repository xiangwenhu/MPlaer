export default {
    fullScree() {
        var docElm = document.documentElement
        //W3C 
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen()
        }
        //FireFox 
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen()
        }
        //Chrome等 
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen()
        }
        //IE11
        else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen()
        }
    }
}