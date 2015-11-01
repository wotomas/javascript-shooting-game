//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(1000, 860);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(0, 420);   // The initial position of the player
var MONSTER_INIT_POS = [];
var MONSTER_ON_PLATFORM = [];
var MONSTER_INIT_DIRECTION = [];
var monsterDisplacement = [];

var CHEAT_MODE = false;
var BOOLEAN_OF_DIS_PLATFORM = [true,true,true];
var movingPlatformGoingDown = true;
var monster_BULLET_SIZE = new Size(10,10);
var monster_BULLET_SPEED = 10.0;
var monster_CAN_SHOOT = true;
var monster_BULLET_COUNT = 0;
var monster_BULLET_SHOOT = 0;

var MOVE = false;
var jumptwice = false; 
 
var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var MONSTER_HORIZONTAL_SPEED = -1;

var GAME_INTERVAL = 25;                     // The time interval of running the game

var BULLET_SIZE = new Size(30, 5);         // The speed of a bullet
var BULLET_SPEED = 10.0;                    // The speed of a bullet
                                            //  = pixels it moves each game loop
var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
var canShoot = true;                        // A flag indicating whether the player can shoot a bullet

var MONSTER_SIZE = new Size(40, 40);        // The speed of a bullet
var PLAYER_FACE_RIGHT = true;
var STAGE = 1;
var MONSTER_COUNT = 0;

//
// Variables in the game
//
var motionType = {NONE:0, LEFT:1, RIGHT:2}; // Motion enum

var svgdoc = null;                          // SVG root document node
var player = null;                          // The player object
var monsters = [];
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
	svgdoc = evt.target.ownerDocument;                          // SVG root document node
	
	//svgdoc.getElementById("highscoretable").style.setProperty("visibility", "hidden", null);
	
	//change player name
	/**
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

    // Create the player
    player = new Player();

    // Create the monsters
    //createMonster(200, 500);
    //createMonster(240, 500);
	//createMonster(280, 500);
	
	if(STAGE == 1) MONSTER_COUNT = 6;
	if(STAGE == 2) MONSTER_COUNT = 10;
	if(STAGE == 3) MONSTER_COUNT = 14;
	
	monster_BULLET_SHOOT = parseInt(Math.random() * MONSTER_COUNT);
	//console.log(monster_BULLET_SHOOT);
	
	for(var i = 0;i < MONSTER_COUNT ; i++) {
		if(i < MONSTER_COUNT / 2) {
			if(i % 2 == 0) {
				createMonster(i, parseInt(150 + Math.random() * 300), parseInt(Math.random() * 200));
			} else {
				createMonster(i, parseInt(570 + Math.random() * 300), parseInt(Math.random() * 200));
			}
		} else {
			createMonster(i, parseInt(170 + Math.random() * 900), parseInt(380 + Math.random() * 200));
		}
		
			
	}
		
    svgdoc.getElementById("high_score_table").setAttribute("style", "visibility:hidden");
	svgdoc.getElementById("startscreen").setAttribute("style", "visibility:hidden");
	
	
	
	//add disappearing platform
    var platforms = svgdoc.getElementById("platforms");
	// Create a new rect element
    var newPlatform = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");
    // Set the various attributes of the line
	newPlatform.setAttribute("id", "disappearing0");
	newPlatform.setAttribute("x", 200);
	newPlatform.setAttribute("y", 700);
    newPlatform.setAttribute("width", 40);
    newPlatform.setAttribute("height", 20);
	newPlatform.setAttribute("type", "disappearing");
	newPlatform.setAttribute("fill", "url(#platform_pattern)");
    newPlatform.setAttribute("opacity", "1");
	// Add the new platform to the end of the group
	platforms.appendChild(newPlatform);
	
	// Create a new rect element
    var newPlatform = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");
    // Set the various attributes of the line
	newPlatform.setAttribute("id", "disappearing1");
	newPlatform.setAttribute("x", 280);
	newPlatform.setAttribute("y", 260);
    newPlatform.setAttribute("width", 100);
    newPlatform.setAttribute("height", 20);
	newPlatform.setAttribute("type", "disappearing");
	newPlatform.setAttribute("fill", "url(#platform_pattern)");
    newPlatform.setAttribute("opacity", "1");
	// Add the new platform to the end of the group
	platforms.appendChild(newPlatform);
	
	// Create a new rect element
    var newPlatform = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");
    // Set the various attributes of the line
	newPlatform.setAttribute("id", "disappearing2");
	newPlatform.setAttribute("x", 800);
	newPlatform.setAttribute("y", 80);
    newPlatform.setAttribute("width", 80);
    newPlatform.setAttribute("height", 20);
	newPlatform.setAttribute("type", "disappearing");
	newPlatform.setAttribute("fill", "url(#platform_pattern)");
    newPlatform.setAttribute("opacity", "1");
	// Add the new platform to the end of the group
	platforms.appendChild(newPlatform);
	
	
	
    // Start the game interval
	//setMonsterMove();
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
	
	monsterMoveInterval = setInterval("setMonsterMove()", 3000);
	
	/**
	//for debugging highscore
	var table = getHighScoreTable();
	showHighScoreTable(table);   
	**/
}
function clearMemory() {
	gameInterval = null;
	monsterMoveInterval = null;
	player = null;                          // The player object
	monsters = [];
	zoom = 1.0;                             // The zoom level of the screen
	bullet = [];
	bullet_number = 0;
	score = 0;
	STAGE = 1;
	MONSTER_INIT_POS = [];
	MONSTER_ON_PLATFORM = [];
	MONSTER_INIT_DIRECTION = [];
	monsterDisplacement = [];
	CHEAT_MODE = false;
	BOOLEAN_OF_DIS_PLATFORM = [true,true,true];
	movingPlatformGoingDown = true;
	monster_BULLET_SIZE = new Size(10,10);
	monster_BULLET_SPEED = 10.0;
	monster_CAN_SHOOT = true;
	monster_BULLET_COUNT = 0;
	monster_BULLET_SHOOT = 0;
	MONSTER_COUNT = 0;
	
	
	MOVE = false;
	jumptwice = false; 
	MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
	JUMP_SPEED = 15;                        // The speed of the player jumping
	VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed
	MONSTER_HORIZONTAL_SPEED = -1;
	GAME_INTERVAL = 25;                     // The time interval of running the game
	BULLET_SIZE = new Size(30, 5);         // The speed of a bullet
	BULLET_SPEED = 10.0;                    // The speed of a bullet
	SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled
	canShoot = true;                        // A flag indicating whether the player can shoot a bullet
	MONSTER_SIZE = new Size(40, 40);        // The speed of a bullet
	PLAYER_FACE_RIGHT = true;
	

	
	svgdoc.documentElement.removeEventListener("keydown", keydown, false);
    svgdoc.documentElement.removeEventListener("keyup", keyup, false);
			
			
	// Remove text nodes in the 'platforms' group
    cleanUpGroup("platforms", true);
	cleanUpGroup("high_score_table", true);
    cleanUpGroup("monster", true);
	
	//clear highscore
	var node = svgdoc.getElementById("game_over_text");
    for(var i = node.childNodes.length-1; i>=0; i--) {
        node.removeChild(node.childNodes.item(i));
    }
	
	//delete mosters
    var svgmonster = svgdoc.getElementById("monsters");   
    for(var i= svgmonster.childNodes.length -1 ; i>=0 ;i--) {
        svgmonster.removeChild(svgmonster.childNodes.item(i));
    } 
}

function restart(evt) {
	console.log("Game Restarted");
	
	//hide end screen
    svgdoc.getElementById("high_score_table").setAttribute("visibility", "hidden");
		
	//in case the game reloads, remove all status to cleanUpGroup
	clearMemory();
	
	//re-load
	load(evt);
}

//
// This function creates the monsters in the game
//
function createMonster(number, x, y) {
	var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
	monster.setAttribute("x", x);
	monster.setAttribute("y", y);
	MONSTER_INIT_POS[number] = new Point(x,y);
	MONSTER_ON_PLATFORM[number] = false;
	MONSTER_INIT_DIRECTION[number] = motionType.RIGHT;
	
	monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
	svgdoc.getElementById("monsters").appendChild(monster);
	
    
	//if monster is the last monster
	if(number == monster_BULLET_SHOOT) {
		var newMonster = new Monster(monster, x, y, true);
	} else {
		var newMonster = new Monster(monster, x, y, false);
	}
    monsters.push(newMonster);
	//console.log("New Monster was added to the list " + JSON.stringify(monsters));
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
// This function shoots a bullet from the player
//
function shootBullet() {
	// Disable shooting for a short period of time
	canShoot = false;
    setTimeout("canShoot = true", SHOOT_INTERVAL);
	bullet_number += 1;
	
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
// This function shoots a bullet from the monster
//
function monsterShootBullet(monster) {
	//console.log("Monster Shoot Bullet!");
	//Disable shooting for a short period of time
	monster_BULLET_COUNT += 1;
	
    // Create the bullet by createing a use node
    var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");

    // Calculate and set the position of the bullet
    bullet.setAttribute("x", monster.position.x + PLAYER_SIZE.w / 2 - monster_BULLET_SIZE.w / 2);
    bullet.setAttribute("y", monster.position.y + PLAYER_SIZE.h / 2 - monster_BULLET_SIZE.h / 2);
	bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monsterbullet");
	
	//console.log(bullet.getAttribute("x") + " " + bullet.getAttribute("y"));
	//console.log(monster.direction);
	if(monster.direction == motionType.RIGHT) {
		svgdoc.getElementById("monsterRightBullets").appendChild(bullet);
	} else {
		svgdoc.getElementById("monsterLeftBullets").appendChild(bullet);
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
		if(CHEAT_MODE) {
			
		} else {
			if (intersect(new Point(x, y), MONSTER_SIZE, player.position, PLAYER_SIZE)) {
				console.log("Hit with monster");
				// Clear the game interval
				clearInterval(gameInterval);
				clearInterval(monsterMoveInterval);

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
	
	//check if monster bullet collides with player
	var bullets = svgdoc.getElementById("monsterRightBullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));
		
		if (intersect(new Point(x, y), monster_BULLET_SIZE, player.position, PLAYER_SIZE)) {
				console.log("Hit from monster bullet!!");
				// Clear the game interval
				clearInterval(gameInterval);
				clearInterval(monsterMoveInterval);

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
	
	var bullets = svgdoc.getElementById("monsterLeftBullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));
		
		if (intersect(new Point(x, y), monster_BULLET_SIZE, player.position, PLAYER_SIZE)) {
				console.log("Hit from monster bullet!!");
				// Clear the game interval
				clearInterval(gameInterval);
				clearInterval(monsterMoveInterval);

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
	
	bullets = svgdoc.getElementById("monsterLeftBullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        
        // Update the position of the bullet
		var x = parseInt(node.getAttribute("x"));
		node.setAttribute("x", x - monster_BULLET_SPEED);	
        	
        // If the bullet is not inside the screen delete it from the group
        if (x < 0) {
            bullets.removeChild(node);
            i--;
			monster_BULLET_COUNT = 0;
        }
    }
	
	bullets = svgdoc.getElementById("monsterRightBullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        
        // Update the position of the bullet
		var x = parseInt(node.getAttribute("x"));
		node.setAttribute("x", x + monster_BULLET_SPEED);	
        	
        // If the bullet is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w) {
            bullets.removeChild(node);
            i--;
			monster_BULLET_COUNT = 0;
        }
    }
}

function setMonsterMove() {
	for(var i = 0; i< monsters.length; i++) {
		if(Math.random() < 0.5) {
			MONSTER_INIT_DIRECTION[i] = true;
		} else {
			MONSTER_INIT_DIRECTION[i] = false;
		}
	}
	if(MOVE) {
		MOVE = false;
	} else {
		MOVE = true;
	}
	console.log("move monster");
	
}
//
// This function updates the position and motion of the player in the system
//
function gamePlay() {
	//move moving platform
	var moving = svgdoc.getElementById("moving");
	var y = parseFloat(moving.getAttribute("y"));
	//console.log("moving platform is at: " + y);
	if(movingPlatformGoingDown) {
		moving.setAttribute("y", y + 1);
	} else {
		moving.setAttribute("y", y - 1);
	}
	
	if(y > 750) {
		movingPlatformGoingDown = false;
	}
	
	if(y < 600) {
		movingPlatformGoingDown = true;
	}
	
	
	//check disappearing platoforms
	for (var i = 0; i < 1; i++) {
		if(BOOLEAN_OF_DIS_PLATFORM[i]) {
			var disappearing = svgdoc.getElementById("disappearing"+i);
		
			if (disappearing.getAttribute("type") == "disappearing") {
				var platformOpacity = parseFloat(disappearing.getAttribute("opacity"));
				//console.log("Opacity is: " + platformOpacity);
				
				if(platformOpacity <= 0) {
					//if platform opacity is less than 0, remove platform
					BOOLEAN_OF_DIS_PLATFORM[i] = false;
					svgdoc.getElementById("platforms").removeChild(disappearing);
				} else {
					var x = parseFloat(disappearing.getAttribute("x"));
					var y = parseFloat(disappearing.getAttribute("y"));
					var w = parseFloat(disappearing.getAttribute("width"));
					var h = parseFloat(disappearing.getAttribute("height"));
					
					//console.log(x + " " + y + " " + w + " " + h);
					
					if (((player.position.x + PLAYER_SIZE.w > x && player.position.x < x + w) || ((player.position.x + PLAYER_SIZE.w) == x && player.motion == motionType.RIGHT) ||
						(player.position.x == (x + w) && player.motion == motionType.LEFT)) &&	player.position.y + PLAYER_SIZE.h == y) {
							//if player touches the dissapearing platform
							//console.log("player is touching the disappearing platform");
							disappearing.setAttribute("opacity", platformOpacity - 0.1);
						}
				}
			}
		}

	}	
	
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

	//monsterFall
	for(var i = 0; i<monsters.length;i++) {
		monsterDisplacement[i] = new Point();
		MONSTER_ON_PLATFORM[i] = monsters[i].isOnPlatform();
				
		//if monster is not on Platform and its vertical is less then 0
		if(!MONSTER_ON_PLATFORM[i] && monsters[i].verticalSpeed <= 0) {
			monsterDisplacement[i].y = -monsters[i].verticalSpeed;
			monsters[i].verticalSpeed -= VERTICAL_DISPLACEMENT;
		}
		//console.log("Monster " + i + " is on platform: " + MONSTER_ON_PLATFORM[i]);
		
		//move monster either left or right
		if(MOVE) {
			//moveMonsters();
			if(MONSTER_ON_PLATFORM[i]) {
				if(MONSTER_INIT_DIRECTION[i]) {
					monsters[i].direction = motionType.LEFT;
					monsterDisplacement[i].x = -monsters[i].horizontalSpeed;
					monsters[i].node.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
				} else {
					monsters[i].direction = motionType.RIGHT;
					monsterDisplacement[i].x = +monsters[i].horizontalSpeed;
					monsters[i].node.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#lmonster");
				}
			}
		}	
		var monsterPosition = new Point();
		
		monsterPosition.x = monsters[i].position.x + monsterDisplacement[i].x;
		monsterPosition.y = monsters[i].position.y + monsterDisplacement[i].y;
		
		monsters[i].collidePlatform(monsterPosition);
		monsters[i].collideScreen(monsterPosition);
		
		monsters[i].position = monsterPosition;
		var node = monsters[i].node;
        
        // Update the position of the monster
		var y = parseInt(node.getAttribute("y"));
		var x = parseInt(node.getAttribute("x"));
		//console.log("Y Axis of monster " + i + " is " + y);
		node.setAttribute("y", monsters[i].position.y);	
		node.setAttribute("x", monsters[i].position.x);	
		
		if(monsters[i].canShoot) {
			if(monster_BULLET_COUNT == 0) {
				monsterShootBullet(monsters[i]);
			}
		}
	}
	
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
