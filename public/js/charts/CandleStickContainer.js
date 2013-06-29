function createCandleStickContainer(prices) {

	candleSlots = prices.length;

	calculateHighLowValues(prices);

	var candleStickContainer = new createjs.Container();

	// y achse
	priceLegend(candleStickContainer);

	// x achse
	var currentDate = null;
	for (var i=0; i<prices.length; i++) {

		currentDate = new Date(prices[i].date);
		if (currentDate.getDay() === 1) {

			var g = new createjs.Graphics();
			g.beginStroke(createjs.Graphics.getRGB(200,200,200));
			g.setStrokeStyle(1);
			g.moveTo(0, 0);
			g.lineTo(0, candleStickContainerHeight + 10);

			// create shape
			var s = new createjs.Shape(g);
			s.x = candleStickContainerWidth - (candleWidth * (i + 1)) + (candleWidth / 2);
			s.x = s.x - ((i + 1) * candleMargin);
			s.y = 0;
			candleStickContainer.addChild(s);

			// text einfügen
			var text = new createjs.Text(currentDate.getDate() + '.' + (currentDate.getMonth() + 1) + '.', '14px Arial', '#000000');
			text.x = candleStickContainerWidth - (candleWidth * (i + 1)) + (candleWidth / 2);
			text.x = text.x - ((i + 1) * candleMargin) - 14;
			text.y = candleStickContainerHeight + 20;
			candleStickContainer.addChild(text);
		};
	}

	// candles
	for (var i=0; i<prices.length; i++) {

		var obj = createCandleGraphicsObject(prices[i], i);

		var s = new createjs.Shape(obj);
		s.x = candleStickContainerWidth - (candleWidth * (i + 1));
		s.x = s.x - ((i + 1) * candleMargin);
		s.y = calculateTopInPixelsFromPrice(prices[i].high);

		candleStickContainer.addChild(s);
	}

	candleStickContainer.x = candleStickContainerLeft;
	candleStickContainer.y = candleStickContainerTop;

	initialScaling = 0;
	createjs.Ticker.addEventListener("tick", initialScalingHandler);

	return candleStickContainer;
}

function calculateTopInPixelsFromPrice(price) {
	return (highest - price) / onePixelPrice;
}

function priceLegend(candleStickContainer) {

	var interval;
	var diff = highest - lowest;

	if (diff > 1 && diff <= 20) {
		interval = 1;
	}
	else {

		if (diff > 20 && diff <= 50) {
			interval = 5;
		}
		else {

			if (diff > 50 && diff <= 100) {
				interval = 10;
			}
			else {

				if (diff > 100 && diff <= 1000) {
					interval = 100;
				}
				else {

					if (diff > 1000) {
						interval = 200;
					}
					else {

						alert('error in function priceLegend');
					}
				}
			}
		}
	}

	// draw a line every 10 euro
	for (var i=lowest; i<=highest; i+=interval) {

		var g = new createjs.Graphics();
		g.beginStroke(createjs.Graphics.getRGB(150,150,150));
		g.setStrokeStyle(1);
		g.moveTo(0, 0);
		g.lineTo(candleStickContainerWidth, 0);

		var s = new createjs.Shape(g);
		s.x = 0;
		s.y = calculateTopInPixelsFromPrice(i);

		// text einfügen
		var text = new createjs.Text(i + ',00', '14px Arial', '#000000');
		text.x = -70;
		text.y = calculateTopInPixelsFromPrice(i) - 8;
		candleStickContainer.addChild(text);

		candleStickContainer.addChild(s);
	}
}

function createCandleGraphicsObject(candle, leftMulti) {

	var right = candleStickContainerWidth - candleMargin - ((leftMulti + 0) * (candleWidth + candleMargin));

	var shadowTop = (Math.round((highest - candle.high) / onePixelPrice));
	var shadowBottom = (Math.round((highest - candle.low) / onePixelPrice));

	var bodyLeft = right - candleWidth;
	var bodyRight = right;

	var middle = bodyLeft + ((bodyRight-bodyLeft)/2);

	if (candle.open == candle.close) {

		var height = candle.open - candle.close;
		var candleHeightInPixels = 1;

		var lengthTopShadow = candle.high - candle.open;
		var lenghtTopShadowInPixels = lengthTopShadow / onePixelPrice;

		var lengthBottomShadow = candle.close - candle.low;
		var lengthBottomShadowInPixels = lengthBottomShadow / onePixelPrice;
	}
	else {

		if (candle.open > candle.close) {

			var height = candle.open - candle.close;

			var candleHeightInPixels = height / onePixelPrice;

			var lengthTopShadow = candle.high - candle.open;
			var lenghtTopShadowInPixels = lengthTopShadow / onePixelPrice;

			var lengthBottomShadow = candle.close - candle.low;
			var lengthBottomShadowInPixels = lengthBottomShadow / onePixelPrice;

			var bodyColor = 'red';
		}
		else {

			var height = candle.close - candle.open;

			var candleHeightInPixels = height / onePixelPrice;

			var lengthTopShadow = candle.high - candle.close;
			var lenghtTopShadowInPixels = lengthTopShadow / onePixelPrice;

			var lengthBottomShadow = candle.open - candle.low;
			var lengthBottomShadowInPixels = lengthBottomShadow / onePixelPrice;

			var bodyColor = 'white';
		}
	}

	var candleTop = 0;
	var candleLeft = 0;

	var g = new createjs.Graphics();
	g.beginStroke(createjs.Graphics.getRGB(0,0,0));
	g.setStrokeStyle(1);
	g.beginFill(bodyColor);

	g.moveTo(candleWidth / 2, 0);
	g.lineTo(candleWidth / 2, lenghtTopShadowInPixels);

	var candleTop = lenghtTopShadowInPixels;

	g.drawRect(0, candleTop, candleWidth, candleHeightInPixels);

	var candleBottom = lenghtTopShadowInPixels + candleHeightInPixels;

	g.moveTo(candleWidth / 2, candleBottom);
	g.lineTo(candleWidth / 2, candleBottom + lengthBottomShadowInPixels);

	return g;
}

function calculateHighLowValues(prices) {

	highest = null;
	lowest = null;

	for (var i=0; i<prices.length; i++) {
		highest = highest === null || prices[i]['high'] > highest ? prices[i]['high'] : highest;
		lowest = lowest === null || prices[i]['low'] < lowest ? prices[i]['low'] : lowest;
	}

	var diff = highest - lowest;

	if (diff >= 1 && diff < 10) {

		highest = Math.ceil(highest);
		lowest = Math.floor(lowest);
	}
	else {

		if (diff >= 10 && diff <= 100) {

			highest = Math.ceil(highest / 10) * 10;
			lowest = Math.floor(lowest / 10) * 10;
		}
		else {

			if (diff > 100 && diff <= 1000) {

				highest = Math.ceil(highest / 100) * 100;
				lowest = Math.floor(lowest / 100) * 100;
			}
			else {

				if (diff > 1000) {

					highest = Math.ceil(highest / 1000) * 1000;
					lowest = Math.floor(lowest / 1000) * 1000;
				}
				else {

					alert('error in function calculateHighLowValues');
				}
			}
		}
	}

	var tmp = highest - lowest;
	onePixelPrice = tmp / candleStickContainerHeight;

	candleWidth = ((candleStickContainerWidth - candleMargin) / candleSlots) - candleMargin;
	candleWidth = Math.round(candleWidth);
}

function initialScalingHandler(){

	initialScaling += 0.05;

	if (initialScaling <= 1) {

		for (var i=0; i<candleStickContainer.getNumChildren(); i++) {
			candleStickContainer.getChildAt(i).scaleY = initialScaling;
		}

		stage.update();
	}
	else {

		createjs.Ticker.removeEventListener('tick', initialScalingHandler);

		for (var i=0; i<candleStickContainer.getNumChildren(); i++) {
			candleStickContainer.getChildAt(i).scaleY = 1;
		}

		stage.update();
	}
}