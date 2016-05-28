/*
webWind.js (c) Coderman64 2016

this allows you to make a virtual window on your webpage out of any element simply by doing something like this:
var element = document.getElementById("your-element");
newWindObj(element,"window-title");

it is a work in progress and may currently be very buggy, but it seems to work fairly well!
It does not work on iOS, nor any other mobile devices, as far as I know.
*/
var totalWind = 0;
function webWind(container, windowTitle){
    totalWind += 1;
    rugg = totalWind.toString();
    //set up DOM
    this.cont = container;
    this.windDiv = document.createElement("DIV");
    this.topBar = document.createElement("DIV");
    text = document.createTextNode(windowTitle);
    this.topBar.appendChild(text)
    this.windDiv.appendChild(this.topBar);
    this.windDiv.appendChild(this.cont);
    document.body.appendChild(this.windDiv);
    //set up CSS
    this.windDiv.style.position = "absolute";
    this.windDiv.style.left = "100px";
    this.windDiv.style.top = "150px";
    this.windDiv.style.border = "2px solid black";
    this.windDiv.style.width = this.cont.width;
    this.windDiv.style.background = "#FFFFFF";
    this.windDiv.id = "windDiv"+totalWind.toString();
    
    this.topBar.style.background = "#999999";
    this.topBar.style.height = "20px";
    this.topBar.style.width = this.windDiv.width;
    this.topBar.id = "topBar"+totalWind.toString();
    
    //set up dragging
    this.dragging = false;
    this.relativeLoc = {x:0,y:0};
    
    this.MouseDown1 = function(evt) {
        var rect = this.topBar.getBoundingClientRect();
        this.relativeLoc = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
        this.dragging = true;
        document.body.appendChild(this.windDiv);
        evt.preventDefault();
    };
    this.MouseUp1 = function(evt) {
        this.dragging = false;
    };
    this.MouseMove1 = function(evt){
        if(this.dragging){
            this.windDiv.style.left = (evt.clientX-this.relativeLoc.x).toString()+"px";
            this.windDiv.style.top = (evt.clientY-this.relativeLoc.y).toString()+"px";
        }
    };
};

function newWindObj(cont, windTitle){
    var tmpWind = new webWind(cont, windTitle);
    tmpWind.topBar.addEventListener("mousedown",function(evt){
        tmpWind.MouseDown1(evt);
    });
    document.addEventListener("mouseup",function(evt){
        tmpWind.MouseUp1(evt);
    });
    document.addEventListener("mousemove",function(evt){
        tmpWind.MouseMove1(evt);
    });
    return tmpWind;
};