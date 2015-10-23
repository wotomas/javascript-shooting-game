function Monster(node, x, y) {
    this.node = node;
    this.position = new Point(x,y);
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
	this.horizontalSpeed = parseFloat(Math.random() * 4) + 1;
}


Monster.prototype.isOnPlatform = function() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + MONSTER_SIZE.w > x && this.position.x < x + w) ||
             ((this.position.x + MONSTER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
             (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + MONSTER_SIZE.h == y) return true;
    }
    if (this.position.y + MONSTER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Monster.prototype.collidePlatform = function(position) {
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

        if (intersect(position, MONSTER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, MONSTER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - MONSTER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Monster.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + MONSTER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - MONSTER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + MONSTER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - MONSTER_SIZE.h;
        this.verticalSpeed = 0;
    }
}