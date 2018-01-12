
var polo = new ccxt.poloniex();


window.addEventListener("load", function load() {
	/*
	chrome.storage.sync.get("", function (data) {

	});
	 */
	alert("background");

	
var bitstamp = new ccxt.bitstamp();

var selectRegion = document.getElementById("selectRegion");
var selectExchangeMarkets = document.getElementById("selectExchangeMarkets")
var selectCryptocurrency = document.getElementById("selectCryptocurrency");

var exchangeMarkets = {}

	console.log(ccxt);
	//polo.fetchCurrencies();
	console.log(new ccxt['poloniex']);

}, false);



function hello() {
	alert("hello");
}

function getTicker() {
	return polo.fetchTickers();
}

var fetchCurrency = async function fetCurrency(market){
	return market.fetchCurrencies();
}

var fetchCurrencies = async function fetchCurrencies(exchangeMarkets){
	for(let i=0; i<exchangeMarkets.length;i++){
		try{
			let exchangeName = exchangeMarkets[i];
			let market = exchangeMarkets[exchangeName];
			if(market==null){
				exchangeMarkets[exchangeName] = new ccxt[exchangeName];
			}
			var currencies = await fetchCurrency(market);
			console.log(exchangeName,currencies);
		}catch(error){
			console.log(exchangeMarkets[i] + " does not support fetchCurrencies()");
		}
	}
	return
}


function populateDropdown(selectElement, dataList){
	for(let i=0; i<dataList.length;i++){
		selectElement.add(new Option(dataList[i],dataList[i]));
	}
}