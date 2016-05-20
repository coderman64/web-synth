var myVar = window.setInterval(redraw , 20);

var getFreq = function(keyNumber){
    return Math.pow(2,((keyNumber-49)/12))*440;
}

var context = new (window.AudioContext || window.webkitAudioContext)(),
    masterVolume = context.createGain(),
    oscillators = {};

masterVolume.gain.value = 0.2;

masterVolume.connect(context.destination);

var canvas = document.getElementById("mainCanvas");
var cont = document.getElementById("keyboard");
var c = canvas.getContext("2d");

var notes = [];
var note = function(key, time, length){
    this.key = key;
    this.time = time;
    this.length = length;
}
note.prototype.draw = function(){
    //(key-30)*10
    c.fillStyle = "#000000";
    c.fillRect(this.time,(this.key-30)*10, this.length, 10);
    c.stroke();
}

var redraw = function(){
    c.fillStyle = "#FFFFFF";
    c.fillRect(0,0,canvas.width,canvas.height);
    c.strokeStyle = "#000000";
    for(var i = 0; i < 20;i++){
        c.moveTo(0,i*10);
        c.lineTo(500,i*10);
        c.stroke();
    }
    for(var i = 0; i < notes.length; i++){
        notes[i].draw();
    }
}

var mouseLoc = {
       x: 0,
       y: 0
    }; 
var mouseDown = false;
canvas.addEventListener("mousedown", function(evt){
    mouseDown = true;
    c.moveTo(mouseLoc.x,mouseLoc.y);
    var osc = context.createOscillator();
    var frequency = getFreq(Math.floor(mouseLoc.y/10)+30);
    //c.fillStyle = "#000000";
    //c.fillRect(mouseLoc.x,Math.floor(mouseLoc.y/10)*10,50,10);
    //c.stroke();
    notes[notes.length] = new note(Math.floor(mouseLoc.y/10)+30, mouseLoc.x, 10);
    notes[notes.length-1].draw();
    osc.frequency.value = frequency;
    osc.type = 'triangle';
    osc.connect(masterVolume);
    oscillators[frequency] = [osc];
    osc.start(context.currentTime);
    osc.stop(context.currentTime+0.2);
});

canvas.addEventListener("mouseup", function(evt){
    mouseDown = false;
});

canvas.addEventListener("mousemove",function(evt){
    var rect = canvas.getBoundingClientRect();
    mouseLoc = {
       x: evt.clientX - rect.left,
       y: evt.clientY - rect.top
    }; 
    cont.innerHTML = "Key No. "+(Math.floor(mouseLoc.y/10)+30).toString();
    if(mouseDown){
        if(notes[notes.length-1].time<mouseLoc.x){
            notes[notes.length-1].length = mouseLoc.x-notes[notes.length-1].time;
        }
    }
});

/*keyboard.keyDown = function (note, frequency) {
    var osc = context.createOscillator(),
        osc2 = context.createOscillator();
    osc.frequency.value = frequency;
    osc.type = 'triangle';
    osc.detune.value = -10;
    osc2.frequency.value = frequency;
    osc2.type = 'triangle';
    osc2.detune.value = 10;
    osc.connect(masterVolume);
    osc2.connect(masterVolume);
    masterVolume.connect(context.destination);
    oscillators[frequency] = [osc, osc2];
    osc.start(context.currentTime);
    osc2.start(context.currentTime);
};
keyboard.keyUp = function (note, frequency) {
    oscillators[frequency].forEach(function (oscillator) {
        oscillator.stop(context.currentTime);
    });
};*/
