window.addEventListener("load", function load() {
	/*
	chrome.storage.sync.get("", function (data) {

	});
	
	 var localStorage = window.localStorage;
	 */
	
	var selectedRegionSet = new Set();
	var selectedExchangeMarkets = document.getElementById("selectExchangeMarkets");
	var selectCryptocurrency = document.getElementById("selectCryptocurrency");


	var exchangeMarkets = {};
	
	initializeSelectRegion(selectedRegionSet);

}, false);

var initializeSelectRegion = function (selectedRegionSet) {
	//populate it first with region
	addDropdown(document.getElementById("selectRegion"), Object.keys(countries).sort());

	//add event for list of exchange markets
	document.getElementById("selectRegion").addEventListener('change', function (event) {
		let regionsChanged = selectHandler(event, selectedRegionSet);
		console.log(regionsChanged);

		for (let country in regionsChanged) {
			if (regionsChanged[country] == "added") {
				console.log('adding', countries[country]);
				addDropdown(document.getElementById("selectExchangeMarkets"), countries[country]);
			} else {
				console.log('removing', countries[country]);
				removeDropDown(document.getElementById("selectExchangeMarkets"), selectedRegionSet, countries[country]);
			}
		}
	});
}

var selectHandler = function (event, setToBeSaved) {
	let listChanged = {};
	let options = event.target.options;
	for (var i = 0, n = options.length; i < n; ++i) {
		let val = options[i].value;
		if (options[i].selected) {

			if (!setToBeSaved.has(val)) {
				listChanged[val] = 'added';
			}
			setToBeSaved.add(val);
		} else if (setToBeSaved.has(val)) {
			setToBeSaved.delete(val);
			listChanged[val] = 'removed';
		}
	}
	return listChanged;
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

function addDropdown(selectElement, dataList) {
	console.log(dataList);
	for (let i = 0; i < dataList.length; i++) {
		let val = dataList[i];
		if (!selectElement.options.namedItem(val)) {
			let opt = new Option(val, val);
			opt.id = val;
			selectElement.add(opt);
			console.log('adding new option:', opt);
		}
	}
}

function removeDropDown(selectElement, selectedRegionSet, dataList) {
	console.log('removedropdown');
	for (let i = 0; i < dataList.length; i++) {
		let val = dataList[i];
		let opt = selectElement.querySelector("#" + val);

		
		let exchangesArray = ccxt.exchanges[val];
		console.log(exchangesArray, selectedRegionSet, isUniqueSet(selectedRegionSet, exchangesArray));
	
	
		if (selectElement.contains(opt) && isUniqueSet(selectedRegionSet, exchangesArray)) {
			selectElement.removeChild(opt);
			console.log('removing option:', opt);
		}
	}
}

function isUniqueSet(selectedRegionSet, exchangesArray) {
	for (let k = 0; k < exchangesArray.length; k++) {
		if (selectedRegionSet.has(exchangesArray[k])) {
			return false;
		}
	}
	return true;
}
