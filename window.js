var windowObj = document.getElementById("canvasWind");
var windowBar = document.getElementById("canvasWindTopBar");
var dragging = false;
var relativeLoc = {
    x:0,
    y:0
};

windowBar.addEventListener("mousedown",function(evt){
    dragging = true;
    var rect = canvas.getBoundingClientRect();
    relativeLoc = {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
};
});

windowBar.addEventListener("mouseup",function(){
    dragging = false;
});

windowBar.addEventListener("mousemove",function(evt){
    if(dragging){
        windowObj.style.left = (evt.clientX-relativeLoc.x).toString()+"px";
        windowObj.style.top = (evt.clientY+relativeLoc.y).toString()+"px";
    }
});