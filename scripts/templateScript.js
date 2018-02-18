let bitApp = {};

bitApp.startEpoch = 0;
bitApp.endEpoch = 0;
bitApp.epochGraphIncrement = 0;

Date.prototype.getUnixTime = function () { return this.getTime() / 1000 | 0 };
if (!Date.now) Date.now = function () { return new Date(); }

Date.time = function () { return Date.now().getUnixTime(); }

bitApp.epochGraph = function (end, start) {
    return Math.floor((end - start) / 11);
};

const dates = [];

bitApp.BTCLoop = function() { for (let i = bitApp.startEpoch; i <= bitApp.endEpoch; i=i+epochGraphIncrement) {
    dates.push(bitApp.buyBTC(i));
}
}

bitApp.buyBTC = (date) => {
    let url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD,EUR&ts=${date}`
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
    }).then(function (res) {
        console.log(res);
        bitApp.buyBTCValue = res.BTC.USD;
        console.log(bitApp.buyBTCValue);
    });
};

bitApp.events = function () {
    $('form').on('submit', async function (e) {
        e.preventDefault();

        const buyDateValue = $('#userBuyDate').val();
        buyDateEpochValue = new Date(buyDateValue).getUnixTime();

        bitApp.startEpoch = await buyDateEpochValue;

        const sellDateValue = $('#userSellDate').val();

        sellDateEpochValue = new Date(sellDateValue).getUnixTime();

        bitApp.endEpoch = await sellDateEpochValue;

        bitApp.epochGraphIncrement = await bitApp.epochGraph (sellDateEpochValue, buyDateEpochValue);
        console.log(bitApp.epochGraphIncrement);

        bitApp.BTCLoop();

        

        // bitApp.buyAmount = $('#userBuyAmount').val();
    });
};

bitApp.init = function () {
    bitApp.events();
    bitApp.epochGraph();
    bitApp.buyBTC();
};

$(function () {
    bitApp.init();
});