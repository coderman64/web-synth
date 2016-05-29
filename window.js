function newSynthWindow(){
    //create elements
    var canvas12 = document.createElement("CANVAS");
    var button12 = document.createElement("BUTTON");
    var buttonText = document.createTextNode("Play!");
    button12.appendChild(buttonText);
    var noteText = document.createElement("A");
    var canvasWind = document.createElement("DIV");
    var canvasScroll = document.createElement("DIV");
    
    //create element hierarchy
    canvasScroll.appendChild(canvas12);
    canvasWind.appendChild(canvasScroll);
    canvasWind.appendChild(button12);
    canvasWind.appendChild(noteText);
    document.body.appendChild(canvasWind);
    
    //style elements
    canvas12.width = 8000;
    canvas12.height = 600;
    canvasScroll.style.overflow = "scroll";
    canvasScroll.style.height = "250px";
    canvasScroll.style.width = "550px";
    
    //create window
    var windObj = newWindObj(canvasWind,"synth window");
    
    //create synthesizer instance
    var synth = newSynth(canvas12, noteText, button12);
    return {window: windObj, synth: synth};
}