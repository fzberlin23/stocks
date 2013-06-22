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

function initMenu(data, textStatus, jqXHR) {
	console.log('jo');
}

function init(stock, prices) {

	$.ajax({
        type: "GET",
        crossDomain: false,
        url: "/stock/loadPrices/" + stock.id,
        dataType: "json",
        success: initMenu
    });

	candleSlots = prices.length;

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

	// candlestickcontainer bauen und einfügen
	candleStickContainer = createCandleStickContainer(prices);
	stage.addChild(candleStickContainer);

	// stage aktualisieren
	stage.update();
}