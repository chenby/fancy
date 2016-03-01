(function(){
    function init(){
        var docWidth = document.documentElement.clientWidth;
        var html = document.querySelector('html');
        html.style.fontSize = (docWidth / 20) + "px";
    };
    init();
    window.addEventListener('resize',init);
})();
