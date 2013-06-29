var prices = new Array();

var stage;
var stageWidth;
var stageHeight;

var candleStickContainer;
var initialScaling = 0;

var highest;
var lowest;
var onePixelPrice;

var candleWidth;
var candleMargin = 10;

var days = 20;

var movingAverageContainers = new Array();

function init() {

	setSizeOfCanvasChart();

	$("#monthSelector a").click(function() {

		$(this).parent().children().removeClass('activated');
		$(this).addClass('activated');

		var days = null;
		switch ($(this).html()) {
			case '1 Monat': days = 20; break;
			case '2 Monate': days = 40; break;
			case '3 Monate': days = 60; break;
		}
		loadPrices(days);
	});

	$("#smaSelector a").click(function() {

		var sma = null;
		switch ($(this).html()) {
			case 'SMA(10)': sma = 10; break;
			case 'SMA(20)': sma = 20; break;
			case 'SMA(30)': sma = 30; break;
		}

		if ($(this).hasClass('activated')) {
			$(this).removeClass('activated');
			stage.removeChild(movingAverageContainers[sma]);
			delete movingAverageContainers[sma];
		}
		else {
			$(this).addClass('activated');
			var movingAverageData = calculateMovingAverage(sma);
			movingAverageContainers[sma] = drawMovingAverage(sma, movingAverageData);
			stage.addChild(movingAverageContainers[sma]);
		}
		stage.update();
	});

	// stage initialisieren
	stage = new createjs.Stage("chartCanvas");

	calculateDimensionsOfStage();

	// text einfügen
	var text = new createjs.Text(stock.symbol, '13px Arial', '#000000');
	text.x = 6;
	text.y = 7;
	stage.addChild(text);

	// resize event benutzen
	$(window).smartresize(
		function() {
			setSizeOfCanvasChart();
			calculateDimensionsOfStage();
			drawChart();
		}, 200
	);

	loadPrices(20);
}

function loadPrices(daysToGet) {

	days = daysToGet;
	$.ajax({
        type: "GET",
        crossDomain: false,
        url: "/stock/loadPrices/" + stock.id + "/" + days,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
			prices = data.prices;
			drawChart();
		}
    });
}

function setSizeOfCanvasChart() {

	var windowHeight = $(window).height();
	$("#chartCanvas").attr('width', $("#contentContainer").width());
	$("#chartCanvas").attr('height', windowHeight - 240);
	$("#chartCanvas").css('height', windowHeight - 240);
}