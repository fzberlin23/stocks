function createCandleStickContainer(prices) {

	calculateHighLowValues(prices);

	var candleStickContainer = new createjs.Container();

	priceLegend(candleStickContainer);

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

	createjs.Ticker.addEventListener("tick", initialScalingHandler);

	return candleStickContainer;
}

function calculateTopInPixelsFromPrice(price) {
	return (highest - price) / onePixelPrice;
}

function priceLegend(candleStickContainer) {

	var diff = highest - lowest;

	if (diff >= 50 && diff <= 100) {

		// draw a line every 10 euro
		for (var i=lowest; i<=highest; i+=10) {

			var g = new createjs.Graphics();
			g.beginStroke(createjs.Graphics.getRGB(150,150,150));
			g.setStrokeStyle(1);
			g.moveTo(0, 0);
			g.lineTo(candleStickContainerWidth, 0);

			var s = new createjs.Shape(g);
			s.x = 0;
			s.y = calculateTopInPixelsFromPrice(i);

			// text einfügen
			var text = new createjs.Text(i + ',00 €', '14px Arial', '#000000');
			text.x = -70;
			text.y = calculateTopInPixelsFromPrice(i) - 5;
			candleStickContainer.addChild(text);

			candleStickContainer.addChild(s);
		}
	}
	else {
		alert('error in function priceLegend');
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
	if (diff >= 10 && diff <= 100) {

		highest = Math.ceil(highest / 10) * 10;
		lowest = Math.floor(lowest / 10) * 10;
	}
	else {
		alert('error in function calculateHighLowValues');
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

		// container.scaleX = container.scaleY = initialScaling;

		stage.update();
	}
	else {

		createjs.Ticker.removeEventListener ('tick', initialScalingHandler);

		for (var i=0; i<candleStickContainer.getNumChildren(); i++) {
			candleStickContainer.getChildAt(i).scaleY = 1;
		}

		stage.update();
	}
}