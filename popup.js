var selectedRegionSet = new Set();
var selectedExchangeMarketSet = new Set();

var exchangeMarkets = {};
var marketInterval = {};
var iconInterval = null;
var port = chrome.extension.connect({
		name: "Icon Display"
	});

window.addEventListener("load", function load() {
	//setup tabs
	$("#tabs").tabs();

	//Icon
	addDropdown(document.getElementById("iconMarketList"), Object.keys(ccxt.exchanges));
	
		let extensionData =	JSON.parse(window.localStorage.getItem("ExtensionIcon"));
		console.log(extensionData, extensionData['allCurrencies']);
		if(extensionData){								
			addDropdown(document.getElementById("iconCryptoList"), extensionData['allCurrencies']);
			
			$("#iconMarketList").val(extensionData['market']);
			$("#iconCryptoList").val(extensionData['currency']);
	
			let range = document.getElementById('iconCryptoRange');	
			range.min = extensionData['minRate'];
			range.max = extensionData['maxRate'];		
			$("#iconCryptoRange").val(extensionData['rate']);
			$("#rangeText").text(extensionData['rate']/1000 + " seconds");
			
		}
				
	$("#iconMarketList").on('change', async function (event) {
		try {
			$("#iconCryptoList").empty();
			let market = event.currentTarget.value;
			console.log(market);
			let currencies = null;
			if (exchangeMarkets[market]) {
				currencies = exchangeMarkets[market]['currency'];
			} else {
				exchangeMarkets[market] = new ccxt[market];
				currencies = await(exchangeMarkets[market]).fetchTickers();
				exchangeMarkets[market]['currency'] = currencies;
			}
			addDropdown(document.getElementById("iconCryptoList"), Object.keys(currencies));	
		
			let range = document.getElementById('iconCryptoRange');	
			range.min = exchangeMarkets[market]['rateLimit']*2;
			range.max = exchangeMarkets[market]['rateLimit']*20;
		
		} catch (error) {
			alert(error);
		}
	});
	
	 $('#iconCryptoRange').on('input change', function () {
        $('#rangeText').text( $(this).val()/1000+" seconds");
    });
	
	//save icon setting
	$("#iconConfirm").on('click', function (event) {
		let symbol = $('#iconCryptoList option:selected').text();
		let market = $('#iconMarketList option:selected').text();
		let allCurrencies =  []; 
		
		let nodeList = document.querySelectorAll("#iconCryptoList > option");
		for(let i=0;i<nodeList.length;i++){
			allCurrencies.push(nodeList[i].value);
		}
		console.log(allCurrencies);
		
		let rangeElement = document.getElementById("iconCryptoRange");
		let rate = rangeElement.value;
		if (symbol && market) {
			window.localStorage.setItem(
				"ExtensionIcon", JSON.stringify({
					"market": market,
					"allCurrencies": allCurrencies,
					"currency": symbol,
					"rate": rate,
					"minRate": rangeElement.min,
					"maxRate": rangeElement.max
				}));

			port.postMessage(JSON.stringify({
					"market": market,
					"currency": symbol,
					"rate": rate
				}));

		}
	});

	//Ticker Chart
	initializeSelectRegion();

}, false);


	
	
function updateDataTable(market, tickerData) {
	if (!$("table[id='" + market + "']")) {
		//console.log('updateDataTable', market, " does not exist");
		return;
	}

	let marketDiv = document.getElementById(market + "Div");
	marketDiv.style.display = "initial";
	let sel = marketDiv.querySelector("select");

	let table = null;
	if (!$.fn.DataTable.isDataTable("table[id='" + market + "']")) {
		//console.log("not datatable");
		table = $("table[id='" + market + "']").DataTable({
				"pageLength": 100,
				columns: [{
						data: "name",
						title: "Symbol"
					}, {
						data: "last",
						title: "Last"
					}, {
						data: "high",
						title: "High"
					}, {
						data: "low",
						title: "Low"
					}, {
						data: "percent",
						title: "Percent Change (%)"
					}
				],
				responsive: true
			});
	}

	let list = [];
	for (let ticker in tickerData) {
		if (tickerData.hasOwnProperty(ticker)) {
			let data = tickerData[ticker];

			let last = data.last ? data.last : 'not supported';
			let high = data.high ? data.high : 'not supported';
			let low = data.low ? data.low : 'not supported';
			let name = data.symbol ? data.symbol : 'not supported';
			let percent = data.percentage ? data.percentage : 'not supported';

			let opt = sel.querySelector("option[value='" + name + "']");

			if (opt.selected) {
				list.push({
					"name": name,
					"last": last,
					"high": high,
					"low": low,
					"percent": percent
				});
			} else {}
		}
	}
	$("table[id='" + market + "']").DataTable().clear().rows.add(list).draw();
}

var initializeSelectRegion = function () {
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
					let selectElement = document.getElementById("selectExchangeMarkets");
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
				if (marketsChanged[market] == "added") {
					let currencies = null;
					if (exchangeMarkets[market]) {
						currencies = exchangeMarkets[market]['currency'];
					} else {
						exchangeMarkets[market] = new ccxt[market];
						currencies = await(exchangeMarkets[market]).fetchTickers();
						exchangeMarkets[market]['currency'] = currencies;
					}

					console.log('currencies:', market, currencies);

					let moduleDiv = createTickerContentDiv(document.getElementById("tableOfContent"), market, currencies, {});
					marketInterval[market] = window.setInterval(async function () {
							console.log('interval:', exchangeMarkets, market);
							if (!exchangeMarkets[market]) {
								exchangeMarkets[market] = new ccxt[market];
							}
							try {
								let cur = await(exchangeMarkets[market]).fetchTickers();
								console.log('Chart request interval for market=', market, ' is 1 request every ', exchangeMarkets[market]['rateLimit'] * 10 / 1000, ' sec.');
								exchangeMarkets[market]['currency'] = cur;
								updateDataTable(market, cur);
							} catch (error) {
								alert(error);
								clearInterval(marketInterval[market]);
								marketInterval[market] = null;
							}
						}, exchangeMarkets[market]['rateLimit'] * 10, market);

					updateDataTable(market, currencies);

				} else {
					let marketDiv = document.getElementById(market + "Div");
					if (marketDiv) {
						//clear market table display and remove intervalCall for ticker
						marketDiv.style.display = "none";
						let intervalID = marketInterval[market];
						clearInterval(intervalID);
						marketInterval[market] = null;
					}
				}

			} catch (error) {
				//console.log(error);
				alert(error);
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
		if (selectElement.options == undefined || !selectElement.options.namedItem(val)) {
			let opt = new Option(val, val);
			opt.id = val;
			selectElement.appendChild(opt);
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
	moduleDiv.id = market + "Div";
	let h2 = document.createElement("h2");
	h2.innerHTML = 'Market: ' + market;
	let sel = document.createElement("select");
	sel.id = market + "Select";
	sel.setAttribute("multiple", "multiple");
	let dataDiv = document.createElement("div");
	dataDiv.className = "table-like";
	dataDiv.id = market + "Data";

	//header for table div
	let tableDiv = document.createElement("table");
	tableDiv.id = market;
	tableDiv.className = "cell-border";
	dataDiv.appendChild(tableDiv);

	let selectSet = new Set();

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
				selectSet.add(opt);
			}
			sel.add(opt);
		}
	}

	//add a eventlistener to control each coin display
	sel.addEventListener('change', function (event) {
		let market = event.target.parentElement.id.replace("Div", "");
		console.log('select change callback with market=', market);
		updateDataTable(market, exchangeMarkets[market]['currency']);
	});

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
