//Extend the cc.Layer object
var MainMenuLayer = cc.Layer.extend(
    {
        //override init function
        init: function ()
        {
            var bRet = false;
            if (this._super())
            {
                //request director to give us current screen dimensions
                var s = cc.Director.getInstance().getWinSize();

                //start up the background music
                this.startBackgroundMusic();

                //load and position the background image
                this.loadBackground(s);

                //load and position menu items
                this.loadMenu(s);

                bRet = true;
            }
            return bRet;
        },
        loadBackground: function (s)
        {
            var bg = new cc.Sprite();
            bg.initWithFile("./resources/art/background-image.jpg", cc.rect(0, 0, s.width, s.height));
            bg.setAnchorPoint(new cc.Point(0.0, 0.0));
            this.addChild(bg);
        },
        loadMenu: function (s)
        {
            var titleLabel = cc.LabelTTF.create("Bug Squash", "Helvetica", 80);
            titleLabel.setPosition(new cc.Point((s.width / 2) - 10, s.height - 100)); //vertically center the label
            //titlelabel.setDimensions(new cc.Size(s.width, 40));
            titleLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            titleLabel.setAnchorPoint(new cc.Point(0.5, 0.5));
            titleLabel.setColor(new cc.Color3B(140, 190, 220));
            titleLabel.enableStroke(new cc.Color3B(0, 0, 0), 4, false);
            var scale = 1;
            var scaleFactor = 0.005;
            var titleVelocity = cc.Point(0, 3);
            titleLabel.schedule(function () {
                scale += scaleFactor;
                this.setScale(scale);
                if ((scaleFactor > 0 && scale > 1.025) || (scaleFactor < 0 && scale < 0.95))
                    scaleFactor *= -1;
            });

            //load and position the menu item
            cc.MenuItemFont.setFontSize(24);
            cc.MenuItemFont.setFontName("Arial");
            var systemMenu = cc.MenuItemFont.create("Play", this.onPlay);
            var menu = cc.Menu.create(systemMenu);
            menu.setPosition(0, 0);
            systemMenu.setAnchorPoint(0, 0);
            systemMenu.setPosition(s.width - 95, 5);

            this.addChild(titleLabel);
            this.addChild(menu, 1, 2);

        },
        startBackgroundMusic: function()
        {
            //audio engine has already been initialized in scripts/main.js
            cc.AudioEngine.getInstance().setMusicVolume(0.25);
            cc.AudioEngine.getInstance().playMusic("resources/music/creamsoda.ogg", true);
        },
        onPlay: function()
        {
            var scene = new GamePlayScene();
            var layer = new GamePlay();
            scene.addChild(layer, 0);
            //cc.Director.pushScene(cc.TransitionSlideInT.create(1, scene));
            cc.Director.getInstance().replaceScene(cc.TransitionCrossFade.create(0.5, scene));
            cc.AudioEngine.getInstance().stopMusic(true);
            cc.AudioEngine.getInstance().playEffect("resources/sfx/Ping.mp3", false);
        }
});

var MainMenuScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new MainMenuLayer();
        layer.init();
        this.addChild(layer);
    }
})
