var GamePlay = cc.Layer.extend({
    init: function () {
        this._super();

        var s = cc.Director.getInstance().getWinSize();

        cc.AudioEngine.getInstance().setMusicVolume(0.10);
        cc.AudioEngine.getInstance().playMusic("resources/music/creamsodaminor.ogg", true);

        this.setTouchEnabled(true);
        var bg = new cc.Sprite();
        bg.initWithFile("./resources/art/background-image.jpg", cc.rect(0, 0, s.width, s.height));
        bg.setAnchorPoint(new cc.Point(0.0, 0.0));
        this.addChild(bg);

        //Add a score label dynamically, because 'javascript don't care'
        var lbl = this.scoreLabel = cc.LabelTTF.create("Score: ", "Helvetica", 40);
        lbl.setPosition(new cc.Point(40, s.height - 80)); //vertically center the label
        //titlelabel.setDimensions(new cc.Size(s.width, 40));
        lbl.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        lbl.setAnchorPoint(new cc.Point(0.0, 0.0));
        lbl.setColor(new cc.Color3B(140, 190, 220));
        lbl.enableStroke(new cc.Color3B(0, 0, 0), 2, false);

        this.addChild(lbl);



        for(x = 0; x <= 10; x++)
        {
            var bug = new BugActor();
            bug.init();
            bug.name = "bug" + x;
            bug.layer = this;
            this.addChild(bug);
        }

        return true;
    },
    adjustScore: function(amount)
    {
        if(!this.score)
        {
            this.score = 0;
        }

        //this is probably not the optimal way to achieve this
        //but for demonstration purposes it will do
        this.score += amount;
        this.removeChild(this.scoreLabel);
        var s = cc.Director.getInstance().getWinSize();
        var lbl = this.scoreLabel = cc.LabelTTF.create("Score: " + this.score, "Helvetica", 40);
        lbl.setPosition(new cc.Point(40, s.height - 80)); //vertically center the label
        //titlelabel.setDimensions(new cc.Size(s.width, 40));
        lbl.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        lbl.setAnchorPoint(new cc.Point(0.0, 0.0));
        lbl.setColor(new cc.Color3B(140, 190, 220));
        lbl.enableStroke(new cc.Color3B(0, 0, 0), 2, false);

        this.addChild(lbl);
    }

});

var GamePlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GamePlay();
        layer.init();
        this.addChild(layer);
    }
})