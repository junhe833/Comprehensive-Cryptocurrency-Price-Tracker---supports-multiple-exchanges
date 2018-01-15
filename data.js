var countries = {
	"US": ["_1broker", "bittrex", "btcx", "coinexchange", "coingi", "coinmarketcap", "gdax", "gemini", "itbit", "kraken", "lakebtc", "livecoin", "okcoinusd", "okex", "poloniex"],
	"PA": ["_1btcxe", "coingi"],
	"AU": ["acx", "btcmarkets", "coinspot", "independentreserve"],
	"CA": ["allcoin", "quadrigacx"],
	"JP": ["anxpro", "binance", "bitflyer", "btcbox", "coincheck", "coinexchange", "quoine", "zaif"],
	"SG": ["anxpro", "fybsg", "luno", "quoine"],
	"HK": ["anxpro", "gatecoin", "hitbtc", "hitbtc2", "kucoin", "mixcoins"],
	"NZ": ["anxpro", "cryptopia", "independentreserve", "wex"],
	"IL": ["bit2c"],
	"PL": ["bitbay", "bitmarket"],
	"EU": ["bitbay", "bitlish", "bitmarket", "bl3p", "btcx", "ccex", "cex", "paymium", "virwox"],
	"ID": ["bitcoincoid", "coincheck"],
	"VG": ["bitfinex", "bitfinex2", "bter"],
	"KR": ["bithumb", "coinexchange"],
	"GB": ["bitlish", "bitstamp", "bitstamp1", "cex", "coinmate", "luno", "mixcoins"],
	"RU": ["bitlish", "cex", "exmo", "getbtc", "livecoin", "xbtce", "yobit"],
	"SC": ["bitmex"],
	"MX": ["bitso"],
	"NL": ["bl3p"],
	"BR": ["bleutrade", "braziliex", "flowbtc", "foxbit", "mercado"],
	"CN": ["btcchina", "bter", "chbtc", "coingi", "gateio", "huobi", "huobicny", "huobipro", "jubi", "okcoincny", "okcoinusd", "okex", "qryptos", "yunbi", "zb"],
	"PH": ["btcexchange"],
	"UA": ["btctradeua", "kuna", "liqui"],
	"TR": ["btcturk"],
	"IS": ["btcx"],
	"TH": ["bxinth"],
	"DE": ["ccex"],
	"CY": ["cex"],
	"CL": ["chilebit"],
	"IN": ["coinexchange", "coinsecure"],
	"VN": ["coinexchange", "quoine", "vbtc"],
	"UK": ["coinfloor", "dsx", "livecoin", "tidex"],
	"BG": ["coingi"],
	"CZ": ["coinmate"],
	"ES": ["exmo"],
	"SE": ["fybse"],
	"VC": ["getbtc"],
	"ZA": ["luno"],
	"CH": ["lykke", "vaultoro"],
	"TZ": ["nova"],
	"FR": ["paymium"],
	"TW": ["qryptos"],
	"AR": ["southxchange"],
	"VE": ["surbitcoin"],
	"MT": ["therock"],
	"PK": ["urdubit"],
	"AT": ["virwox"]
}



/*
var initialize = async function () {	
	//Convert from array of currency[regions] to array of region[currencies]
	var exchanges = ccxt.exchanges;
	console.log(exchanges);

	var countries = {};
	for (let currency in exchanges) {
		let countryArray = exchanges[currency];
		for (let i = 0; i < countryArray.length; i++) {
			let country = countryArray[i];
			if (countries.hasOwnProperty(country)) {
				let currenciesList = countries[country];
				
				let param = null;
				try{
					param = await fetchCurrency(new ccxt[currency])
				}catch(error){
					param = error;
				}
				let obj = {};
				obj[currency] = param;
				
				currenciesList.push(obj);
				countries[country] = currenciesList;
			} else {
				
				let param = null;
				try{
					param = await fetchCurrency(new ccxt[currency])
				}catch(error){
					param = error;
				}
					let obj = {};
				obj[currency] = param;
				
				countries[country] = [obj];
			}
		}
	}
	console.log(countries);

    var str = JSON.stringify(countries);
	console.log(str);
}

*/
