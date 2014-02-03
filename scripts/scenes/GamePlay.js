var GamePlay = cc.Layer.extend({
    init: function () {
        this._super();

        var s = cc.Director.getInstance().getWinSize();

        cc.AudioEngine.getInstance().setMusicVolume(0.10);
        cc.AudioEngine.getInstance().playMusic("resources/music/creamsodaminor.ogg", true);

        var bg = new cc.Sprite();
        bg.initWithFile("./resources/art/background-image.jpg", cc.rect(0, 0, s.width, s.height));
        bg.setAnchorPoint(new cc.Point(0.0, 0.0));
        this.addChild(bg);

//        var bug = new cc.Sprite();
//        bug.initWithFile("./resources/art/windows-bug.png", cc.rect(0, 0, 80, 80));
//        bug.setAnchorPoint(new cc.Point(0.5, 0.5));
//        bug.setPosition(new cc.Point(s.width / 2, s.height / 2));
//        bug.setScale(0.5);

        for(x = 0; x <= 10; x++)
        {
            var bug = new BugActor();
            bug.init();
            this.addChild(bug);
        }

        return true;
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