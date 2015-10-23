

//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "N".charCodeAt(0):
            player.motion = motionType.LEFT;
            break;

        case "M".charCodeAt(0):
            player.motion = motionType.RIGHT;
            break;
			
        case "Z".charCodeAt(0):
            if (player.isOnPlatform()) {
                player.verticalSpeed = JUMP_SPEED;
            } else if(!jumptwice){
				player.verticalSpeed = JUMP_SPEED / 1.6;
				jumptwice = true;
			}
            break;
		case 32:
			if (canShoot) {
				shootBullet();
			}
			break;
	//add a case to shoot bullet
    }
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "N".charCodeAt(0):
            if (player.motion == motionType.LEFT) {
				player.motion = motionType.NONE;
			}
            break;

        case "M".charCodeAt(0):
            if (player.motion == motionType.RIGHT) {
				player.motion = motionType.NONE;
			}
            break;
    }
}
