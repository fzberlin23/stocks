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

var days = 20;

var movingAverageContainers = new Array();

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
	// sprite = new Image();
    // sprite.src = '/img/button.png';
    // sprite.onload = addButton;

	loadPrices(20);
}

function loadPrices(daysToGet) {
	days = daysToGet;
	$.ajax({
        type: "GET",
        crossDomain: false,
        url: "/stock/loadPrices/" + stock.id + "/" + days,
        dataType: "json",
        success: drawPrices
    });
}

function drawPrices(data, textStatus, jqXHR) {

	prices = data.prices;

	// remove old stuff
	stage.removeChild(candleStickContainer);
	for (i=0; i<movingAverageContainers.length; i++) {
		if (typeof movingAverageContainers[i] !== 'undefined') {
			stage.removeChild(movingAverageContainers[i]);
		}
	}
	stage.update();

	// add candlestickcontainer
	candleStickContainer = createCandleStickContainer(prices.slice(0, days));
	stage.addChild(candleStickContainer);

	// redraw moving averages if necessary
	for (i=0; i<movingAverageContainers.length; i++) {
		if (typeof movingAverageContainers[i] !== 'undefined') {
			var movingAverageData = calculateMovingAverage(i);
			movingAverageContainers[i] = drawMovingAverage(i, movingAverageData);
			stage.addChild(movingAverageContainers[i]);
		}
	}
}

function drawMovingAverage(period, movingAverageData) {

	var color = null;
	switch (period) {
		case 10: color = createjs.Graphics.getRGB(0,0,200); break;
		case 20: color = createjs.Graphics.getRGB(51,153,0); break;
		case 30: color = createjs.Graphics.getRGB(255,153,0); break;
	}

	// calculate coordinates
	var coordinates = new Array();
	for (var i=0; i<days; i++) {
		coordinates[i] = new Object();
		coordinates[i]['x'] = candleStickContainerWidth - (candleWidth * (i + 1)) + (candleWidth / 2);
		coordinates[i]['x'] = coordinates[i]['x'] - ((i + 1) * candleMargin);
		coordinates[i]['y'] = calculateTopInPixelsFromPrice(movingAverageData[i].value);
	}

	var movingAverageContainer = new createjs.Container();

	for (var i=0; i<days; i++) {

		var g = new createjs.Graphics();
		g.setStrokeStyle(1);
		g.beginStroke(color);
		g.beginFill(color);
		g.drawCircle(0,0,2);

		// create shape
		var s = new createjs.Shape(g);
		s.x = coordinates[i]['x'];
		s.y = coordinates[i]['y'];

		//candleStickContainer.addChild(s);
		movingAverageContainer.addChild(s);
	}

	movingAverageContainer.x = candleStickContainerLeft;
	movingAverageContainer.y = candleStickContainerTop;

	return movingAverageContainer;

	//	g.moveTo(0, 0);
	//	g.lineTo(100, 100);
	//	g.bezierCurveTo (0, 50, 50, 50, 100, 100);
}

function calculateMovingAverage(movingAveragePeriod) {

	// generate moving average of each price
	var movingAverage = new Array();

	for (var i=0; i<prices.length; i++) {

		if (prices.length - i < movingAveragePeriod) {
			break;
		}

		var tmp = 0.00;
		for (j = i; j < i + movingAveragePeriod; j++) {
			tmp += prices[j]['close'];
		}

		movingAverage[i] = new Object();
		movingAverage[i]['date'] = prices[i]['date'];
		movingAverage[i]['value'] = Math.round(tmp / movingAveragePeriod * 100) / 100;
	}

	return movingAverage;
}