
function testNumberFormat() {

	var testCases = {
		0.1: '0.1',
		0.0015: '0.0015',
		100: '100',
		1000: '1k',
		1001: '1.001k',
		1100: '1.1k',
		10000: '10k',
		100000: '100k',
		2560000: '2.56M',
		10000000: '10M'
	};

	for (let num in testCases) {
		if (testCases.hasOwnProperty(num)) {
			let res = numberFormat.format(num);
			if (res != testCases[num]) {
				console.log('failed test case:', res, ' | ', testCases[num]);
			}
		}
	}
}
