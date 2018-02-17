

let bitApp = {};

bitApp.sellBTCValue = 0;
bitApp.buyBTCValue = 0;
bitApp.buyAmount = 0;
bitApp.BTCAmountBought = 0;
bitApp.startEpoch = 0;
bitApp.endEpoch = 0;
bitApp.epochGraphIncrement = 0;

bitApp.epochGraph = function() {
    bitApp.epochGraphIncrement = bitApp.endEpoch - bitApp.startEpoch;  
    console.log('this is finding graph points')
};

bitApp.purchasedBTC = function () {
    bitApp.BTCAmountBought = bitApp.buyAmount / bitApp.buyBTCValue;
    console.log('this is finding btc purchase')
};

Date.prototype.getUnixTime = function () { return this.getTime() / 1000 | 0 };
    if (!Date.now) Date.now = function () { return new Date(); }
    Date.time = function () { return Date.now().getUnixTime(); }

bitApp.events = function() {
    $('form').on('submit', function (e) {
        e.preventDefault();

        const buyDateValue = $('#userBuyDate').val();
        buyDateEpochValue = new Date(buyDateValue).getUnixTime();

        bitApp.startEpoch = buyDateEpochValue;

        bitApp.buyBTC(buyDateEpochValue); 

        const sellDateValue = $('#userSellDate').val();
        sellDateEpochValue = new Date(sellDateValue).getUnixTime();

        bitApp.endEpoch = sellDateEpochValue;

        bitApp.sellBTC(sellDateEpochValue);

        bitApp.buyAmount = $('#userBuyAmount').val();
    });   
};

bitApp.buyBTC = (date) => {
    let url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD,EUR&ts=${date}`
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
    }).then(function (res) {
        console.log(res);
        bitApp.buyBTCValue = res.BTC.USD;
    });
};

bitApp.sellBTC = (date) => {
    let url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD,EUR&ts=${date}`
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
    }).then(function (res) {
        console.log(res);
        bitApp.sellBTCValue = res.BTC.USD;
    });
};

bitApp.init = function() {
    bitApp.events();
    bitApp.purchasedBTC();
    bitApp.epochGraph();
    
};

$(function () {
    bitApp.init();
});