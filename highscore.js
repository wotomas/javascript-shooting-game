//
// A score record JavaScript class to store the name and the score of a player
//
function ScoreRecord(name, score) {
    this.name = name;
    this.score = score;
}


//
// This function reads the high score table from the cookies
//
function getHighScoreTable() {
    var table = new Array();

    for (var i = 0; i < 10; i++) {
        // Contruct the cookie name
        // Get the cookie value using the cookie name
		var cookie = getCookie("player" + i);
				
        // If the cookie does not exist exit from the for loop
		if(cookie == null) {
			break;
		}
		
        // Extract the name and score of the player from the cookie value
		var extractedData = cookie.split("~");
		//console.log(extractedData);
		
        // Add a new score record at the end of the array
		table.push(new ScoreRecord(extractedData[0],extractedData[1]));
    }

    return table;
}

    
//
// This function stores the high score table to the cookies
//
function setHighScoreTable(table) {
    for (var i = 0; i < 10; i++) {
        // If i is more than the length of the high score table exit
        // from the for loop
        if (i >= table.length) break;

        // Contruct the cookie name
		var highscoreCookie = table[i].name + "~" + table[i].score;
		//setCookie(name, value, expires, path, domain, secure)
		var now = new Date(); // create an instance of the Date object
		now.setTime(now.getTime() + 365*24*60*60*1000); // expires in 365 days
        // Store the ith record as a cookie using the cookie name
		setCookie("player" + i, highscoreCookie, now);
    }
}


//
// This function adds a high score entry to the text node
//
function addHighScore(record, node, rank) {
   //create a rect button to add under 
      
   // Create the name text span
    var name = svgdoc.createElementNS("http://www.w3.org/2000/svg", "tspan");
	//console.log("The person is ranked on: " + rank);
	
    // Set the attributes and create the text
	name.setAttribute("x", 80);
    name.setAttribute("dy", 48);
	
	//set color if ranked top of 5
	if(rank < 5) {
		name.setAttribute("style", "fill:red");
	}
	
	
    name.appendChild(document.createTextNode(record.name));
	
    // Add the name to the text node
	node.appendChild(name);
	
    // Create the score text span
    var score = svgdoc.createElementNS("http://www.w3.org/2000/svg", "tspan");

	//set color if ranked top of 5
	if(rank < 5) {
		score.setAttribute("style", "fill:red");
	}
	
    // Set the attributes and create the text
    score.setAttribute("x", 700);
    score.appendChild(document.createTextNode(record.score));

    // Add the name to the text node
    node.appendChild(score);
}

    
//
// This function shows the high score table to SVG 
//
function showHighScoreTable(table) {
    // Show the table
    var node = svgdoc.getElementById("high_score_table");
    node.style.setProperty("visibility", "visible", null);

    // Get the high score text node
    var node = svgdoc.getElementById("game_over_text");
    
    for (var i = 0; i < 10; i++) {
        // If i is more than the length of the high score table exit from the for loop
        if (i >= table.length) break;

        // Add the record at the end of the text node
        addHighScore(table[i], node, i);
    }
}


//
// The following functions are used to handle HTML cookies
//

//
// Set a cookie
//
function setCookie(name, value, expires, path, domain, secure) {
    var curCookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
    document.cookie = curCookie;
}


//
// Get a cookie
//
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else
        begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1)
        end = dc.length;
    return unescape(dc.substring(begin + prefix.length, end));
}


//
// Delete a cookie
//
function deleteCookie(name, path, domain) {
    if (get_cookie(name)) {
        document.cookie = name + "=" + 
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}
