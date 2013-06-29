function calculateDimensionsOfStage() {

	stageWidth = $("#chartCanvas").width();
	stageHeight = $("#chartCanvas").height();

	// left
	candleStickContainerLeft = 80;

	// top
	candleStickContainerTop = 50;

	// width
	candleStickContainerWidth = stageWidth - 100;

	// height
	candleStickContainerHeight = stageHeight - 100;
}

function drawChart() {

	// remove old stuff
	stage.removeChild(candleStickContainer);
	for (i=0; i<movingAverageContainers.length; i++) {
		if (typeof movingAverageContainers[i] !== 'undefined') {
			stage.removeChild(movingAverageContainers[i]);
		}
	}
	stage.update();

	if (prices.length < 1) {
		var text = new createjs.Text('Für diese Aktie sind noch keine Kurse in der Datenbank vorhanden.', '13px Arial', '#000000');
		text.x = 6;
		text.y = 25;
		stage.addChild(text);
		stage.update();
		return;
	}

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