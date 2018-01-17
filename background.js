var selectedRegionSet = new Set();
var selectedExchangeMarketSet = new Set();
var selectCryptocurrency = new Set();
var exchangeMarkets = {};

window.addEventListener("load", async function load() {
	/*
	chrome.storage.sync.get("", function (data) {

	});

	var localStorage = window.localStorage;
	 */

	// fetchMarketsCurrencies(['okex']);

	initializeSelectRegion();
}, false);

var initializeSelectRegion = function () {
	//populate it first with region
	//addDropdown(document.getElementById("selectRegion"), Object.keys(countries).sort());

	addDropdown(document.getElementById("selectRegion"), Object.keys(countries));

	//add event for list to populate exchange markets in response to selecting regions
	document.getElementById("selectRegion").addEventListener('change', function (event) {
		let regionsChanged = selectHandler(event, selectedRegionSet);
		//console.log(regionsChanged);

		for (let country in regionsChanged) {
			if (regionsChanged[country] == "added") {
				//console.log('adding', countries[country]);
				addDropdown(document.getElementById("selectExchangeMarkets"), countries[country]);
			} else {
				//console.log('removing', countries[country]);
				let dataList = countries[country];
				for (let i = 0; i < dataList.length; i++) {
					let val = dataList[i];
					let selectElement = event.target;
					let opt = selectElement.querySelector("#" + val);

					let exchangesArray = ccxt.exchanges[val];
					if (selectElement.contains(opt) && isUniqueSet(selectedRegionSet, exchangesArray)) {
						selectElement.removeChild(opt);
					}
				}
			}
		}
	});

	//add event for list to populate cryptocurrency in response to selecting exchange markets
	document.getElementById("selectExchangeMarkets").addEventListener('change', async function (event) {
		console.clear();
		let marketsChanged = selectHandler(event, selectedExchangeMarketSet);
		console.log('Markets affected:', marketsChanged);
		for (let market in marketsChanged) {
			try {
				let currencies = await(new ccxt[market]).fetchTickers();
				console.log('currencies:', market, currencies);

				if (currencies) {
					if (marketsChanged[market] == "added") {
						let obj = {};
						let moduleDiv = createTickerContentDiv(document.getElementById("tableOfContent"), market, currencies, obj);
					} else {}
				}
			} catch (error) {
				console.log(error);
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

//not all are supported in the library
var fetchMarketsCurrencies = async function fetchMarketsCurrencies(selectedMarkets) {
	var result = {};
	for (let i = 0; i < selectedMarkets.length; i++) {
		try {
			let exchangeName = selectedMarkets[i];

			let market = exchangeMarkets[exchangeName];
			if (market == null) {
				market = new ccxt[exchangeName];
				exchangeMarkets[exchangeName] = market;
			}

			var currencies = await market.fetchCurrencies();
			exchangeMarkets[exchangeName]['currencies'] = currencies;
			result[exchangeName] = currencies;
		} catch (error) {
			console.log(selectedMarkets[i] + " does not support fetchCurrencies(). \n", error);
		}
	}
	return result;
}

function addDropdown(selectElement, dataList) {
	for (let i = 0; i < dataList.length; i++) {
		let val = dataList[i];
		if (!selectElement.options.namedItem(val)) {
			let opt = new Option(val, val);
			opt.id = val;
			selectElement.add(opt);
		}
	}
}

//check if set has any element that is in array
function isUniqueSet(set, array) {
	for (let k = 0; k < array.length; k++) {
		if (set.has(array[k])) {
			return false;
		}
	}
	return true;
}

/*
Create a div module that displays the ticker info as a child of the parentElement.

return: the module div if created or null if not
 */
function createTickerContentDiv(parentElement, market, tickerData, filterOject = null) {
	if (parentElement == null || parentElement.nodeType != Node.ELEMENT_NODE) {
		return null;
	}
	//prevent duplicate content div
	if (parentElement.querySelector("#" + market) != null) {
		return null;
	}

	let moduleDiv = document.createElement("div");
	moduleDiv.id = market;
	let h2 = document.createElement("h2");
	h2.innerHTML = 'Market: ' + market;
	let sel = document.createElement("select");
	sel.id = market + "Select";
	sel.setAttribute("multiple", "multiple");
	let dataDiv = document.createElement("div");
	dataDiv.className = "table-like";
	dataDiv.id = market + "Data";

	//header for table div
	let tableHeader = document.createElement("div");
	appendChildrenRowDiv(tableHeader, ["Currency", "High", "Low", "Percent Change"]);
	dataDiv.appendChild(tableHeader);

	//add a eventlistener to control each coin display
	sel.addEventListener('change', function (event) {
		let options = event.target.options;
		for (var i = 0, n = options.length; i < n; ++i) {
			let val = options[i].value;

			//dataDiv does not exist already then add
			let dataDiv = event.target.parentElement.querySelector("div[id='" + val.replace("/", "\\/") + "']");
			console.log("SelectChangeListener", dataDiv);
			if (options[i].selected && dataDiv == null) {
				let rowDiv = document.createElement("div");
				rowDiv.id = name;
				appendChildrenRowDiv(rowDiv, [name, high, low, percent]);
				dataDiv.appendChild(rowDiv);

			} else if (!options[i].selected && dataDiv != null) {
				dataDiv.style.display = "none";
			}
		}
	});

	for (let ticker in tickerData) {
		if (tickerData.hasOwnProperty(ticker)) {
			let data = tickerData[ticker];

			let high = data.high;
			let low = data.low;
			let name = data.symbol;
			let percent = data.percentage;

			let opt = new Option(name, name);
			opt.id = name;
			if (filterOject != null && filterOject.hasOwnProperty(name)) {
				opt.selected = false;
			} else {
				opt.selected = true;
				let rowDiv = document.createElement("div");
				rowDiv.id = name;
				appendChildrenRowDiv(rowDiv, [name, high, low, percent]);
				dataDiv.appendChild(rowDiv);
			}
			sel.add(opt);
		}
	}

	moduleDiv.appendChild(h2);
	moduleDiv.appendChild(sel);
	moduleDiv.appendChild(dataDiv);
	parentElement.appendChild(moduleDiv);

	return moduleDiv;
}

function appendChildrenRowDiv(parentElement, textList) {
	for (let i = 0; i < textList.length; i++) {
		let col = document.createElement("span");
		col.innerHTML = textList[i];
		parentElement.appendChild(col);
	}
}
