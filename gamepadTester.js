var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
var cooldown = 250;
var lastPress = new Date();
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e){
  addgamepad(e.gamepad);
}

function disconnecthandler(e){
  removegamepad(e.gamepad);
}

function addgamepad(gamepad){
  controllers[gamepad.index] = gamepad;
  rAF(updateStatus);
}

function removegamepad(gamepad) {
  delete controllers[gamepad.index];
}

//la funzione gamepads trova tutti i gamepad collegati al computer
//e li aggiunge all'array controllers
function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && (gamepads[i].index in controllers)) {
      controllers[gamepads[i].index] = gamepads[i];
    }
  }
}

function updateStatus(){
  scangamepads();
  for(j in controllers){
    var controller = controllers[j];
    for(var i=0;i<controller.buttons.length;i++){
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      var touched = false;
      if(typeof(val) == "object"){
        pressed = val.pressed;
        if('touched' in val){
          touched = val.touched;
        }
        val = val.value;
      }
      if(pressed){
        var currentPress = new Date();
        var diff = currentPress-lastPress;
        if(diff>=cooldown){
          var key = setKey(i);
          //console.log("Tasto " + i + " premuto: " + key);
          document.getElementById("pressed").innerHTML = i;
          lastPress=currentPress;
        }
      }
    }
  }
  rAF(updateStatus);
}

function setKey(keyNumber){
  var keys = ["X", "Cerchio", "Quadrato", "Triangolo", "L1", "R1", "L2", "R2", "Share", "Start", "L3", "R3", "Su", "Giu'", "Sinistra", "Destra", "PS", "Touchpad"];

  document.getElementById("key").innerHTML = keys[keyNumber];
  return keys[keyNumber];
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}




