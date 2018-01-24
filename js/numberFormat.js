var iconDisplayFormat=(function(){let multipliers=[{value:1000,symbol:'k'},{value:1000000,symbol:'M'},{value:1000000000,symbol:'B'}];return function(num,precision){for(let i=multipliers.length-1;i>=0;i--){let val=multipliers[i]['value'];if(num>=val){return(num/val).toPrecision(precision)+multipliers[i]['symbol'];}}
if(num<=0.001){precision-=2;}
return num.toPrecision(precision);};})();