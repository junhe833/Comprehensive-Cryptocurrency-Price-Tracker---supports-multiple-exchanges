var exchangeMarkets = {};
var iconInterval = {};
const iconPrecision = 4;

chrome.extension.onConnect.addListener(function (port) {
	//console.log("Connected .....");
	port.onMessage.addListener(function (msg) {
		console.log("message recieved " + msg);

		let obj = JSON.parse(msg);

		let market = obj['market'];
		let symbol = obj['currency'];
		let rate = obj['rate'];

		if (!exchangeMarkets[market]) {
			exchangeMarkets[market] = new ccxt[market];
		}
		iconTicker(market, symbol, rate);
	});

});

async function iconTicker(market, symbol, rate) {
	if (!iconInterval[market]) {
		await startTicker(market, symbol, rate);
	} else {
		alert("Icon will be updated after " + rate + " seconds.");
		await clearInterval(iconInterval[market]);
	}

	iconInterval[market] = window.setInterval(function () {
			startTicker(market, symbol, rate);
		}, rate, market);

}

async function startTicker(market, symbol, rate) {
	try {
		let data = await(exchangeMarkets[market]).fetchTicker(symbol);
		chrome.browserAction.setBadgeText({
			text: data.last ? iconDisplayFormat(data.last, iconPrecision) : 'n/a'
		});
		console.log('Icon request for ', market, ' is 1 request every ', rate / 1000, ' sec.');

	} catch (error) {
		console.log(error);
		alert(error);
		clearInterval(iconInterval[market]);
		iconInterval[market] = null;
	}
}
