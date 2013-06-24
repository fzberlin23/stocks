function addButton() {

	// create the spriteSheet
	spriteSheet = new createjs.SpriteSheet({
		images: [sprite],
		frames: {width:178, height:105,numFrames : 3},
		animations: {
			normal:[0,0],
			hover:[1,1],
			pressed:[2,2]
		}
	});

	button = new createjs.BitmapAnimation(spriteSheet);
	button.x = 0;
	button.y = 0;

	// set default button state
	button.gotoAndStop(0);

	// add the button to the stage
	stage.addChild(button);
	stage.update();
	stage.enableMouseOver(50);

	button.onMouseOver = function()
	{
		this.gotoAndStop('hover');
		stage.update();
	}

	button.onMouseOut = function()
	{
		this.gotoAndStop('normal');
		this.getStage().update();
	}

	button.onPress = function()
	{
		this.gotoAndStop('pressed');
		stage.update();
	}

	button.onClick = function() {
		this.gotoAndStop('normal');
		stage.update();
		loadPrices();
	};
}