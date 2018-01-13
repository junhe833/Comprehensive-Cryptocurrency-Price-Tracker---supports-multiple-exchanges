window.addEventListener("load", function load() {
	/*
	chrome.storage.sync.get("", function (data) {

	});
	 */

	var localStorage = window.localStorage;
	var selectRegion = document.getElementById("selectRegion");
	var selectExchangeMarkets = document.getElementById("selectExchangeMarkets")
		var selectCryptocurrency = document.getElementById("selectCryptocurrency");

	var exchangeMarkets = {};

	console.log(ccxt);

	//localStorage.setItem('exchanges',ccxt.exchanges);

	initialize();

}, false);

var initialize = function () {
	//initialize map
	var exchanges = ccxt.exchanges;
	for (let i = 0; i < exchanges.length; i++) {

		//console.log(exchanges[i]+':[\''+(new ccxt[exchanges[i]]).countries + '\']');

	}

}

var fetchCurrency = async function fetCurrency(market) {
	return market.fetchCurrencies();
}

var fetchCurrencies = async function fetchCurrencies(selectedMarkets) {
	for (let i = 0; i < selectedMarkets.length; i++) {
		try {
			let exchangeName = selectedMarkets[i];

			let market = exchangeMarkets[exchangeName];
			if (market == null) {
				exchangeMarkets[exchangeName] = new ccxt[exchangeName];
			}

			var currencies = await fetchCurrency(market);
			exchangeMarkets[exchangeName]['currencies'] = currencies;

			console.log(exchangeName, currencies);
		} catch (error) {
			console.log(selectedMarkets[i] + " does not support fetchCurrencies()");
		}
	}
	return
}

function populateDropdown(selectElement, dataList) {
	for (let i = 0; i < dataList.length; i++) {
		selectElement.add(new Option(dataList[i], dataList[i]));
	}
}
