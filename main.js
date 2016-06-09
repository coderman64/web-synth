var newSynthButton = document.getElementById("newSynth");

newSynthButton.addEventListener("click",function(){
    newSynthWindow();
});

var partsCanvas = document.getElementById("partsCanvas");
var rect = partsCanvas.getBoundingClientRect();
partsCanvas.width = window.innerWidth;
partsCanvas.height = window.innerHeight-rect.top;
partsCanvas.position = "absoulte";
partsCanvas.style.left = "0px";