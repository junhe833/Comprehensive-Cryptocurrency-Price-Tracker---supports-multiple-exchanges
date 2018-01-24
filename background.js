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
		if (!exchangeMarkets[market]) {
			exchangeMarkets[market] = new ccxt[market];
		}
		iconTicker(market, symbol);
	});

});

function iconTicker(market, symbol) {
	clearInterval(iconInterval);
	iconInterval = window.setInterval(async function () {
			try {
				let data = await(exchangeMarkets[market]).fetchTicker(symbol);
				chrome.browserAction.setBadgeText({
					text: data.last ? iconDisplayFormat(data.last, iconPrecision) : 'n/a'
				});
				console.log('Icon request=', market, ' is 1 request every ', exchangeMarkets[market]['rateLimit'] * 2 / 1000, ' sec.');

			} catch (error) {
				console.log(error);
				alert(error);
				clearInterval(iconInterval);
			}
		}, exchangeMarkets[market]['rateLimit'] * 2, market);

}
