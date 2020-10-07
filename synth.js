/*var canvas = document.getElementById("mainCanvas");
var cont = document.getElementById("keyboard");
var c = canvas.getContext("2d");
var rightButton = false;
var notes = [];
var myVar = window.setInterval(redraw , 100);
var play = 0;
var playbutton = document.getElementById("play");*/

var context = new (window.AudioContext || window.webkitAudioContext)(),
    masterVolume = context.createGain(),
    oscillators = {};
    
masterVolume.gain.value = 0.2;

masterVolume.connect(context.destination);
var note = function(key, time, length){
    this.key = key;
    this.time = time;
    this.length = length;
    this.osc = null;
}
note.prototype.draw = function(c){
    //(key-30)*10
    c.fillStyle = "#000000";
    c.fillRect(this.time,(this.key)*10, this.length, 10);
    c.stroke();
}

var getFreq = function(keyNumber){
    return Math.pow(2,((keyNumber-49)/12))*440;
}

/*var mouseLoc = {
       x: 0,
       y: 0
    }; 
var mouseDown = false;*/
/***************************************************************************************** */
var synthApp = function(canvas1, cont1, playbutton1, part){
    this.canvas = canvas1;
    this.cont = cont1;
    this.c = this.canvas.getContext("2d");
    this.rightButton = false;
    if(part){
        this.notes = part;
    }else{
        this.notes = [];
    }
    this.interval = null;
    this.play = 0;
    this.playbutton = playbutton1;
    this.mouseLoc = {x:0, y:0};
    this.mouseDown = false;
    this.resize = -1;
}

synthApp.prototype.mouseDown1 = function(evt){
    this.mouseDown = true;
    if(evt.button === 0){
        for(var i = 0; i<this.notes.length; i++){
            var noteY = (this.notes[i].key)*10
            if(this.mouseLoc.x > this.notes[i].time&&this.mouseLoc.x<(this.notes[i].time+this.notes[i].length)&&this.mouseLoc.y>noteY&&this.mouseLoc.y<noteY+10){
                    this.notes[i].length = Math.ceil((this.mouseLoc.x-this.notes[i].time)/5)*5;
                    this.resize = i;
            }
        }
        if(this.resize == -1){
            var osc = context.createOscillator();
            var frequency = getFreq(Math.floor(this.mouseLoc.y/10));
            this.notes[this.notes.length] = new note(Math.floor(this.mouseLoc.y/10), Math.round(this.mouseLoc.x/5)*5, 10);
            this.notes[this.notes.length-1].draw(this.c);
            osc.frequency.value = frequency;
            osc.type = 'triangle';
            osc.connect(masterVolume);
            osc.start(context.currentTime);
            osc.stop(context.currentTime+0.2);
        }
        this.canvas.style.cursor = "col-resize";
    }else if(evt.button == 2){
        this.rightButton = true;
    }
}

synthApp.prototype.mouseUp1 = function(evt){
    this.mouseDown = false;
    this.resize = -1;
    if(evt.button == 2){//if the right button is pressed
        this.rightButton = false;
    }
    this.canvas.style.cursor = "default";
};

synthApp.prototype.mouseMove1 = function(evt){
    var rect = this.canvas.getBoundingClientRect();
    this.mouseLoc = {
       x: evt.clientX - rect.left,
       y: evt.clientY - rect.top
    }; //change the "mouseLoc" variable to reflect the mouse's current position
    this.cont.innerHTML = "Key No. "+(Math.floor(this.mouseLoc.y/10)).toString();
    if(this.mouseDown && evt.button == 0&& this.rightButton == false){
        if(this.resize>-1){
            this.notes[this.resize].length = Math.round((this.mouseLoc.x-this.notes[this.resize].time)/5)*5;
        }else if(this.notes.length > 0 && this.notes[this.notes.length-1].time<this.mouseLoc.x){
            this.notes[this.notes.length-1].length = Math.round((this.mouseLoc.x-this.notes[this.notes.length-1].time)/5)*5;//allows you to drag out the length of the note
        }
    }
};

synthApp.prototype.playClick = function(){
    if(this.play>0){
        this.play = 0;
        this.playbutton.innerHTML = "Play!";//stops playback and changes the button text to "Play!"
    }else{
        this.play = 1;
        this.playbutton.innerHTML = "Stop!";//begins playback and changes the button text to "Stop!"
    }
}

synthApp.prototype.redraw = function(){
    this.c.beginPath();
    this.c.fillStyle = "#FFFFFF";
    this.c.fillRect(0,0,this.canvas.width,this.canvas.height);
    for(var i = 0; i < Math.max(Math.floor(this.canvas.width/20),Math.floor(this.canvas.height/10));i++){
        if(i/4==Math.floor(i/4)){
            this.c.lineWidth = 2;
        }else{
            this.c.lineWidth = 1;
        }
        
        // if(this.mouseLoc.x > this.notes[i].time&&this.mouseLoc.x<(this.notes[i].time+this.notes[i].length)&&this.mouseLoc.y>noteY&&this.mouseLoc.y<noteY+10){
        //     this.notes[i].length = Math.ceil((this.mouseLoc.x-this.notes[i].time)/5)*5;
        // }
        this.c.strokeStyle = "#000000";
        this.c.moveTo(i*20,0);
        this.c.lineTo(i*20,this.canvas.height);
        this.c.stroke();
        this.c.beginPath();
        this.c.strokeStyle = "#000000";
        if((i-6)/12==Math.floor((i-6)/12)){
            this.c.lineWidth = 2;
        }else{
            this.c.lineWidth = 1;
        }
        this.c.moveTo(0,i*10);
        this.c.lineTo(this.canvas.width,i*10);
        this.c.stroke();
        this.c.beginPath();
    }
    for(var i = 0; i < this.notes.length; i++){
        this.notes[i].draw(this.c);
        if(this.play>this.notes[i].time&&this.play<this.notes[i].time+6){
            if(this.notes[i].osc){
                this.notes[i].osc.stop(context.currentTime);
            }
            this.notes[i].osc = context.createOscillator();
            var frequency = getFreq(this.notes[i].key);
            this.notes[i].osc.frequency.value = frequency;
            this.notes[i].osc.type = 'triangle';
            this.notes[i].osc.connect(masterVolume);
            this.notes[i].osc.start(context.currentTime);
        }
        if(this.notes[i].osc&&((this.play>(this.notes[i].time+this.notes[i].length)&&this.play<(this.notes[i].time+this.notes[i].length)+6)||this.play < 1)){
            this.notes[i].osc.stop(context.currentTime);
        }
        var noteY = (this.notes[i].key)*10
        if(this.mouseLoc.x > this.notes[i].time&&this.mouseLoc.x<(this.notes[i].time+this.notes[i].length)&&this.mouseLoc.y>noteY&&this.mouseLoc.y<noteY+10){
                if(this.rightButton){
                    this.notes.splice(i,1);
                    i--;
                }else if(this.mouseDown == false){
                    this.canvas.style.cursor = "w-resize";
                }
        }else if(this.canvas.style.cursor == "w-resize"){
            this.canvas.style.cursor = "default";
        }
    }
    if(this.play > 0){
        this.c.beginPath();
        this.play += 5;
        this.c.strokeStyle = "#FF0000";
        this.c.moveTo(this.play,0);
        this.c.lineTo(this.play,this.canvas.height);
        this.c.stroke();
        if(this.play>this.canvas.width){
            this.play = 0;
            this.playbutton.innerHTML = "Play!";
        }
    }
};

function newSynth(canvas1, cont1, playbutton1){
    var temp12 = new synthApp(canvas1, cont1, playbutton1);
    canvas1.addEventListener("mousedown",function(e){temp12.mouseDown1(e);});
    canvas1.addEventListener("mouseup",function(e){temp12.mouseUp1(e);});
    canvas1.addEventListener("mousemove",function(e){temp12.mouseMove1(e);});
    canvas1.addEventListener("contextmenu",function(e){e.preventDefault();});
    playbutton1.addEventListener("click",function(){temp12.playClick();});
    temp12.interval = window.setInterval(function(){temp12.redraw();},100);
    return temp12;
}
/****************************************************************************************************** */