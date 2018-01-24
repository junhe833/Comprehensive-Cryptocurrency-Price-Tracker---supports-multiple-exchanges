var exchangeMarkets = {};
var iconInterval = null;
const iconPrecision = 4;

chrome.extension.onConnect.addListener(function (port) {
	console.log("Connected .....");
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

function iconTicker(market, symbol, rate) {
	clearInterval(iconInterval);
	iconInterval = window.setInterval(async function () {
			try {
				let data = await(exchangeMarkets[market]).fetchTicker(symbol);
				chrome.browserAction.setBadgeText({
					text: data.last ? iconDisplayFormat(data.last, iconPrecision) : 'n/a'
				});
				console.log('Icon request for ', market, ' is 1 request every ', rate / 1000, ' sec.');

			} catch (error) {
				console.log(error);
				alert(error);
				clearInterval(iconInterval);
			}
		}, rate, market);

}
