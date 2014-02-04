var BugActor = cc.Sprite.extend
({
    init: function()
    {
        this._super();

        //use this singleton throughout the code where you need to know the current game window size
        var s = cc.Director.getInstance().getWinSize();

        //initialize a random location of the sprite
        var x = Math.round(Math.random() * (s.width - 40)) + 1;
        var y = Math.round(Math.random() * (s.height - 40)) + 1;
        this.setPosition(new cc.Point(x, y));

        //anchor transformations at the center of the sprite
        this.setAnchorPoint(new cc.Point(0.5, 0.5));
        this.setScale(0.5);

        //This should work... not sure why it doesn't.  Perhaps one of many bugs?
        //var tex = cc.TextureCache.getInstance().addImage("resources/art/windows-bug.png");
        //this.setTextureRect(cc.rect(0, 0, 80, 80));
        //this.setTexture(tex);
        //Instead... use this method which is effectively a different constructor... not sure of exact behavior
        this.initWithFile("resources/art/windows-bug.png", cc.rect(0, 0, 80, 80));

        //these properties do not exist in the base class...
        //but with javascript all things are possible
        //set up random speed at which the bug moves
        this.vectorVelocity = Math.round(Math.random() * 3);

        //point the bug in a random direction on the screen
        this.desiredLocation = this.chooseNewTargetLocation();
        this.vectorAngle = this.getAngleForTarget(x, y, this.desiredLocation.x, this.desiredLocation.y);

        //set up a variable for rotation angle when bug stops and changes direction vector
        this.confusedRotation = 2;

        //now that we have our random heading... set the rotation angle of the sprite to match
        this.rotateTowardTarget();

        //In order to get in on the game loop you must register to receive event callbacks.
        //This ensures that the update...draw methods will fire respectively
        this.scheduleUpdate();
    },
    update: function(timedelta)
    {
        var current = this.getPosition();
        var pos = new cc.Point(current.x + (Math.cos(this.vectorAngle) * this.vectorVelocity), current.y + (Math.sin(this.vectorAngle) * this.vectorVelocity));
        this.setPosition(pos);
        var distanceX = this.desiredLocation.x - pos.x;
        var distanceY = this.desiredLocation.y - pos.y;
//        if(this.name == "bug1")
//        {
//            console.log("Distance between objects: " + Math.sqrt(distanceX * distanceX + distanceY * distanceY));
//        }
        if(Math.sqrt(distanceX * distanceX + distanceY * distanceY) < 10)
        {
           this.desiredLocation = this.chooseNewTargetLocation();
           this.vectorAngle = this.getAngleForTarget(current.x, current.y, this.desiredLocation.x, this.desiredLocation.y);
           //now that we have our random heading... set the rotation angle of the sprite to match
           this.setRotation(((this.vectorAngle * (180 / Math.PI)) * -1) + 90);
        }
    },
    chooseNewTargetLocation: function()
    {
        var s = cc.Director.getInstance().getWinSize();
        return new cc.Point(Math.round(Math.random() * (s.width - 40)) + 1, Math.round(Math.random() * (s.height - 40)) + 1);
    },
    getAngleForTarget: function(srcX, srcY, targetX, targetY)
    {
        return Math.atan2(targetY - srcY, targetX - srcX);
    },
    rotateTowardTarget: function()
    {
        this.setRotation(((this.vectorAngle * (180 / Math.PI)) * -1) + 90);
    }
});
