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

function init(prices) {

	candleSlots = prices.length;

	// stage initialisieren
	stage = new createjs.Stage("demoCanvas");

	stageWidth = stage.canvas.width;
	stageHeight = stage.canvas.height;

	candleStickContainerWidth = stageWidth - 200;
	candleStickContainerHeight = stageHeight - 100;
	candleStickContainerLeft = 100;
	candleStickContainerTop = 50;

	// text einfügen
	var text = new createjs.Text('ADS.de 080384', '13px Arial', '#000000');
	text.x = 4;
	text.y = 4;
	stage.addChild(text);

	// candlestickcontainer bauen und einfügen
	candleStickContainer = createCandleStickContainer(prices);
	stage.addChild(candleStickContainer);

	// stage aktualisieren
	stage.update();
}