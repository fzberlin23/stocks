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

		movingAverageContainer.addChild(s);
	}

	movingAverageContainer.x = candleStickContainerLeft;
	movingAverageContainer.y = candleStickContainerTop;

	return movingAverageContainer;
}