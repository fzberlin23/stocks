var prices = new Array();

var stageWidth;
var stageHeight;

var highest;
var lowest;
var onePixelPrice;
var candleWidth;
var candleMargin = 10;

var stage;
var candleStickContainer;
var initialScaling = 0;

function init() {

	// stage initialisieren
	stage = new createjs.Stage("demoCanvas");

	stageWidth = $("#demoCanvas").width();
	stageHeight = $("#demoCanvas").height();

	candleStickContainerWidth = stageWidth - 200;
	candleStickContainerHeight = stageHeight - 100;
	candleStickContainerLeft = 100;
	candleStickContainerTop = 50;

	// text einfügen
	var text = new createjs.Text(stock.symbol, '13px Arial', '#000000');
	text.x = 6;
	text.y = 7;
	stage.addChild(text);

	// button erstellen
	sprite = new Image();
    sprite.src = '/img/button.png';
    sprite.onload = addButton;

	loadPrices(1);
}

function loadPrices(months) {
	$.ajax({
        type: "GET",
        crossDomain: false,
        url: "/stock/loadPrices/" + stock.id + "/" + months,
        dataType: "json",
        success: drawPrices
    });
}

function drawPrices(data, textStatus, jqXHR) {

	prices = data.prices;

	stage.removeChild(candleStickContainer);
	stage.update();

	// candlestickcontainer bauen und einfügen
	candleStickContainer = createCandleStickContainer(prices);
	stage.addChild(candleStickContainer);

	// stage aktualisieren
	stage.update();
}

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