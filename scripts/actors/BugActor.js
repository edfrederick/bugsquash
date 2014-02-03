var BugActor = cc.Sprite.extend
({
    init: function()
    {
        this._super();
        var x = Math.round(Math.random() * (1136 - 40)) + 1;
        var y = Math.round(Math.random() * (640 - 40)) + 1;
        this.setAnchorPoint(new cc.Point(0.5, 0.5));
        this.setPosition(new cc.Point(x, y));
        this.setScale(0.5);

        //This should work... not sure why it doesn't.  Perhaps one of many bugs?
        //var tex = cc.TextureCache.getInstance().addImage("resources/art/windows-bug.png");
        //this.setTextureRect(cc.rect(0, 0, 80, 80));
        //this.setTexture(tex);
        this.initWithFile("resources/art/windows-bug.png", cc.rect(0, 0, 80, 80));

        //these properties do not exist in the base class...
        //but with javascript all things are possible
        this.xVelocity = 0;
        this.yVelocity = Math.floor((Math.random() * 10) + 1) * -1;
        this.vectorAngle = (Math.round(Math.random() * 360) + 1) * (Math.PI / 180);

        //now that we have our custom heading... set the rotation angle of the sprite to match
        this.setRotation(this.vectorAngle * (180 / Math.PI));

        //In order to get in on the game loop you must register.
        //This ensures that the update...draw methods will fire respectively
        this.scheduleUpdate();
    },
    update: function(delta)
    {
        var current = this.getPosition();
        var modifier = Math.random() > 0.5 ? 1 : -1;
        this.setPosition(new cc.Point(current.x + (this.xVelocity * modifier), current.y + (this.yVelocity * modifier)));
    }



});
