// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}


// The player class used in this program
function Player() {
    this.node = svgdoc.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
}

Player.prototype.isOnPlatform = function() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
             ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
             (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}


//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(1000, 560);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(0, 420);   // The initial position of the player

var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var GAME_INTERVAL = 25;                     // The time interval of running the game

var BULLET_SIZE = new Size(10, 10);         // The speed of a bullet
var BULLET_SPEED = 10.0;                    // The speed of a bullet
                                            //  = pixels it moves each game loop
var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
var canShoot = true;                        // A flag indicating whether the player can shoot a bullet

var MONSTER_SIZE = new Size(40, 40);        // The speed of a bullet
var PLAYER_FACE_RIGHT = true;

//
// Variables in the game
//
var motionType = {NONE:0, LEFT:1, RIGHT:2}; // Motion enum

var svgdoc = null;                          // SVG root document node
var player = null;                          // The player object
var gameInterval = null;                    // The interval
var zoom = 1.0;                             // The zoom level of the screen
var bullet = [];
var bullet_number = 0;
var score = 0;
var PLAYER_NAME = "Anonymous";


//
// The load function for the SVG document
//
function load(evt) {
    // Set the root node to the global variable
    svgdoc = evt.target.ownerDocument;
	//svgdoc.getElementById("highscoretable").style.setProperty("visibility", "hidden", null);
	
	//change player name
	/** for testing remove promtp
    var player_name = prompt("What is your name?", PLAYER_NAME);
    if(player_name.length >0) {
		PLAYER_NAME = player_name;
	} else {
		PLAYER_NAME = "Anonymous";
	}
	**/
    svgdoc.getElementById("player_name").textContent=PLAYER_NAME;
	
	
    // Attach keyboard events
    svgdoc.documentElement.addEventListener("keydown", keydown, false);
    svgdoc.documentElement.addEventListener("keyup", keyup, false);

    // Remove text nodes in the 'platforms' group
    cleanUpGroup("platforms", true);

    // Create the player
    player = new Player();

    // Create the monsters
    createMonster(200, 500);
    createMonster(240, 500);
	createMonster(280, 500);
	createMonster(320, 500);
	
    svgdoc.getElementById("high_score_table").setAttribute("style", "visibility:hidden");
    // Start the game interval
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
}


//
// This function removes all/certain nodes under a group
//
function cleanUpGroup(id, textOnly) {
    var node, next;
    var group = svgdoc.getElementById(id);
    node = group.firstChild;
    while (node != null) {
        next = node.nextSibling;
        if (!textOnly || node.nodeType == 3) // A text node
            group.removeChild(node);
        node = next;
    }
}


//
// This function creates the monsters in the game
//
function createMonster(x, y) {
	var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
	monster.setAttribute("x", x);
	monster.setAttribute("y", y);
	
	monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
	svgdoc.getElementById("monsters").appendChild(monster);
	
}


//
// This function shoots a bullet from the player
//
function shootBullet() {
	// Disable shooting for a short period of time
	canShoot = false;
    setTimeout("canShoot = true", SHOOT_INTERVAL);

    // Create the bullet by createing a use node
    var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");

    // Calculate and set the position of the bullet
    bullet.setAttribute("x", player.position.x + PLAYER_SIZE.w / 2 - BULLET_SIZE.w / 2);
    bullet.setAttribute("y", player.position.y + PLAYER_SIZE.h / 2 - BULLET_SIZE.h / 2);
	if(!PLAYER_FACE_RIGHT) {
		bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#lbullet");
	} else {
		bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
	}
    // Set the href of the use node to the bullet defined in the defs node
    

    // Append the bullet to the bullet group
	if(PLAYER_FACE_RIGHT == true) {
		svgdoc.getElementById("rightBullets").appendChild(bullet);
	} else {
		svgdoc.getElementById("leftBullets").appendChild(bullet);
	}
		
}


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


//
// This function checks collision
//
function collisionDetection() {
    // Check whether the player collides with a monster
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monster = monsters.childNodes.item(i);
        var x = parseInt(monster.getAttribute("x"));
        var y = parseInt(monster.getAttribute("y"));

        if (intersect(new Point(x, y), MONSTER_SIZE, player.position, PLAYER_SIZE)) {
			console.log("Hit with monster");
            // Clear the game interval
            clearInterval(gameInterval);

            // Get the high score table from cookies
			var table = getHighScoreTable();
			
            // Create the new score record
			var scoreRecord = new ScoreRecord(PLAYER_NAME, score);
			console.log("New Score Record is saved: " + scoreRecord.name + " " +scoreRecord.score);
            // Insert the new score record
			for(var i=0; i<10; i++) {
				if(table[i]==null || table[i].score < score) {
					break;
				}
			}
			if(i < 10) {
				table.splice(i, 0, scoreRecord);
			}

            // Store the new high score table
			setHighScoreTable(table);
			
            // Show the high score table
			showHighScoreTable(table);   

            return;
        }
    }

    // Check whether a bullet hits a monster
    var bullets = svgdoc.getElementById("rightBullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));

        for (var j = 0; j < monsters.childNodes.length; j++) {
            var monster = monsters.childNodes.item(j);
            var mx = parseInt(monster.getAttribute("x"));
            var my = parseInt(monster.getAttribute("y"));

            if (intersect(new Point(x, y), BULLET_SIZE, new Point(mx, my), MONSTER_SIZE)) {
				score += 10;
				console.log("Monster Shot down: current Score: " + score );
                monsters.removeChild(monster);
                j--;
                bullets.removeChild(bullet);
                i--;
                //write some code to update the score
            }
        }
    }
	
	bullets = svgdoc.getElementById("leftBullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));

        for (var j = 0; j < monsters.childNodes.length; j++) {
            var monster = monsters.childNodes.item(j);
            var mx = parseInt(monster.getAttribute("x"));
            var my = parseInt(monster.getAttribute("y"));

            if (intersect(new Point(x, y), BULLET_SIZE, new Point(mx, my), MONSTER_SIZE)) {
				score += 10;
				console.log("Monster Shot down: current Score: " + score );
                monsters.removeChild(monster);
                j--;
                bullets.removeChild(bullet);
                i--;
                //write some code to update the score
            }
        }
    }
	
	svgdoc.getElementById("score").textContent=score;
}


//
// This function updates the position of the bullets
//
function moveBullets() {
    // Go through all bullets
	var bullets = svgdoc.getElementById("rightBullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        
        // Update the position of the bullet
		var x = parseInt(node.getAttribute("x"));
		node.setAttribute("x", x + BULLET_SPEED);	
        	
        // If the bullet is not inside the screen delete it from the group
        if (x < 0) {
            bullets.removeChild(node);
            i--;
        }
    }
	
	bullets = svgdoc.getElementById("leftBullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        
        // Update the position of the bullet
		var x = parseInt(node.getAttribute("x"));
		node.setAttribute("x", x - BULLET_SPEED);	
        	
        // If the bullet is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w) {
            bullets.removeChild(node);
            i--;
        }
    }
	
}


//
// This function updates the position and motion of the player in the system
//
function gamePlay() {
    // Check collisions, call the collisionDetection when you create the monsters and bullets

    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();
    
    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT) {		
        player.node.setAttribute("transform", "translate("+ (parseFloat(player.position.x) + 40)+","+player.position.y+") "+"scale(" + -1 + "," + 1 + ")");
		//console.log("player xy position: " + player.position.x + " " +  player.position.y);
		PLAYER_FACE_RIGHT = false;
        displacement.x = -MOVE_DISPLACEMENT;
	}
    if (player.motion == motionType.RIGHT) {
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
		PLAYER_FACE_RIGHT = true;
        displacement.x = MOVE_DISPLACEMENT;
	}
	
	
    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;

    // Move the bullets, call the movebullets when you create the monsters and bullets
    collisionDetection();
	moveBullets();
    updateScreen();
}


//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//
function updateScreen() {
	// Transform the player
	if(PLAYER_FACE_RIGHT) {
		player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
	} else {
        player.node.setAttribute("transform", "translate("+ (parseFloat(player.position.x) + 40)+","+player.position.y+") "+"scale(" + -1 + "," + 1 + ")");
	}
    // Calculate the scaling and translation factors	
    var scale = new Point(zoom, zoom);
    var translate = new Point();
    
    translate.x = SCREEN_SIZE.w / 2.0 - (player.position.x + PLAYER_SIZE.w / 2) * scale.x;
    if (translate.x > 0) 
        translate.x = 0;
    else if (translate.x < SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x)
        translate.x = SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x;

    translate.y = SCREEN_SIZE.h / 2.0 - (player.position.y + PLAYER_SIZE.h / 2) * scale.y;
    if (translate.y > 0) 
        translate.y = 0;
    else if (translate.y < SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y)
        translate.y = SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y;
            
    // Transform the game area
    svgdoc.getElementById("gamearea").setAttribute("transform", "translate(" + translate.x + "," + translate.y + ") scale(" + scale.x + "," + scale.y + ")");	

}


//
// This function sets the zoom level to 2
//
function setZoom() {
    if(zoom == 2.0) {
		zoom = 1.0;
	} else {
		zoom = 2.0;
	}
}
