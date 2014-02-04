var BugActor = cc.Sprite.extend
({
    init: function()
    {
        //call the base constructor
        this._super();

        //TOUCH
        cc.Director.getInstance().getTouchDispatcher()._addTargetedDelegate(this, 1, true);

        //use this singleton throughout the code where you need to know the current game window size
        var s = cc.Director.getInstance().getWinSize();

        //initialize a random location of the sprite
        var x = Math.round(Math.random() * (s.width - 20)) + 1;
        var y = Math.round(Math.random() * (s.height - 20)) + 1;
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
        this.vectorVelocity = Math.round(Math.random() * 5) + 1;

        //point the bug in a random direction on the screen
        this.desiredLocation = this.chooseNewTargetLocation();
        this.vectorAngle = this.getAngleForTarget(x, y, this.desiredLocation.x, this.desiredLocation.y);

        //now that we have our random heading... set the rotation angle of the sprite to match
        this.rotateTowardTarget();

        //In order to get in on the game loop you must register to receive event callbacks.
        //This ensures that the update...draw methods will fire respectively
        this.scheduleUpdate();
    },
    killMe: function()
    {
        //the touch delegate has detected this sprite has been touched
        //so squash the bug...
        this.vectorVelocity = 0; //stop moving
        var texture = cc.TextureCache.getInstance().addImage(s_Fire);
        var emitter = cc.ParticleExplosion.create();
        emitter.initWithTotalParticles(20);
        emitter.setTexture(texture);
        emitter.setPosition(this.getPosition());
        emitter.setSpeed(300);
        this.layer.addChild(emitter);
        var fadeMe = cc.FadeOut.create(2);
        this.destruct(fadeMe);
        this.getParent().adjustScore(1);
    },
    update: function(timedelta)
    {
        //called every tick of the game loop, in our case once every 60th of a second
        //the timedelta argument gives us the time since the last call to this method
        var current = this.getPosition();

        //using the vectorAngle and vectorVelocity, increment the current x and y to move the sprite to the next point
        //toward the respective desiredLocation point
        var pos = this.calculateNewPosition(current);
        this.setPosition(pos);

        //determine if the new position is "very close" to the desiredLocation point
        var distanceX = this.desiredLocation.x - pos.x;
        var distanceY = this.desiredLocation.y - pos.y;
        if(Math.sqrt(distanceX * distanceX + distanceY * distanceY) < 5)
        {
           //once the bug has reached the destination choose a new random destination
           this.desiredLocation = this.chooseNewTargetLocation();
           this.vectorAngle = this.getAngleForTarget(current.x, current.y, this.desiredLocation.x, this.desiredLocation.y);
           //now that we have our random heading... set the rotation angle of the sprite to match
           this.setRotation(((this.vectorAngle * (180 / Math.PI)) * -1) + 90);
        }
    },
    calculateNewPosition: function(p)
    {
        //increment a point by a velocity vector and an angle in radians
        return new cc.Point(p.x + (Math.cos(this.vectorAngle) * this.vectorVelocity),
            p.y + (Math.sin(this.vectorAngle) * this.vectorVelocity));
    },
    chooseNewTargetLocation: function()
    {
        //return new random point that is in the bounds of the window (scene) size
        var s = cc.Director.getInstance().getWinSize();
        return new cc.Point(Math.round(Math.random() * (s.width - 40)) + 1, Math.round(Math.random() * (s.height - 40)) + 1);
    },
    getAngleForTarget: function(srcX, srcY, targetX, targetY)
    {
        //return the angle in radians between the two points
        return Math.atan2(targetY - srcY, targetX - srcX);
    },
    rotateTowardTarget: function()
    {
        //rotate this sprite instance toward the targeted vector
        this.setRotation(((this.vectorAngle * (180 / Math.PI)) * -1) + 90);
    },
    setClickable:function()
    {
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, true);
    },
    setUNClickable:function()
    {
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
    },
    getRect:function()
    {
        return cc.rect(-this._rect.size.width / 2, -this._rect.size.height / 2, this._rect.size.width, this._rect.size.height);
    },
    containsTouchLocation:function (touch)
    {    // function for locating a touch pos ONLY
        var getPoint = touch.getLocation();
        var myRect = this.getBoundingBoxToWorld();

//        myRect._origin.x += this.getPosition().x;
//        myRect._origin.y += this.getPosition().y;

        return cc.rectContainsPoint(myRect, getPoint);
    },
    onTouchBegan:function (touch, event)
    {
        if (!this.containsTouchLocation(touch))
        {
            return false;
        }
        else
        {
            this._selected=true;
            cc.log("onTouchBegan");
            this.killMe();
            return true;
        }
    },
    onTouchMoved:function (touch, event)
    {
        if (this.containsTouchLocation(touch) && this._selected)
        {
            cc.log("onTouchMoved")
        }
    },
    onTouchEnded:function (touch, event)
    {
        this._selected=false;
        cc.log("onTouchEnded")
    },
    onTouchesCancelled:function (touches, event)
    {
        this._selected=false;
        console.log("onTouchesCancelled");
    },
    destruct: function(a)
    {
        var actionDone = cc.CallFunc.create(function(node)
        {
            node.removeFromParent();
        }, this);
        this.runAction(cc.Sequence.create(a, actionDone));
    }
});
