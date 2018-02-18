let bitApp = {};
bitApp.startEpoch = 0;
bitApp.endEpoch = 0;
bitApp.epochGraphIncrement = 0;
bitApp.BTCBuyPrice = 0;
bitApp.BTCSellPrice = 0;
Date.prototype.getUnixTime = function () { return this.getTime() / 1000 | 0 };
if (!Date.now) Date.now = function () { return new Date(); }
Date.time = function () { return Date.now().getUnixTime(); }
bitApp.epochGraph = function (end, start) {
    // return Math.floor((end - start) / 10);
    return (end - start) / 10;
};
// $.when(...BTCPricesHistory)
//     .then((...args) => {
//         args = args.map(data => data[0]);
//     });
let numberofEpochPoints = [1, 2, 3, 4, 5, 6, 7, 8]
const epochDates = [];
bitApp.EpochArray = function () {
    for (let i = 0; i < numberofEpochPoints.length; i++) {
        epochDates.push(bitApp.startEpoch + (bitApp.epochGraphIncrement * numberofEpochPoints[i]));
    }
}
const BTCPricesHistory = [];
bitApp.BTCLoop = function () {
    for (let i = 0; i < epochDates.length; i++) {
        BTCPricesHistory.push(bitApp.buyBTC(epochDates[i]));
        console.log(BTCPricesHistory);
    }
}
bitApp.buyBTC = (date) => {
    let url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD,EUR&ts=${date}`

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
    }).then(function (res) {
        // console.log(res);
        console.log(res.BTC);
        // console.log(bitApp.buyBTCValue);
    });
    //???
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
        bitApp.epochGraphIncrement = await bitApp.epochGraph(sellDateEpochValue, buyDateEpochValue);
        await bitApp.EpochArray();
        bitApp.BTCLoop();
        bitApp.BTCBuyPrice = bitApp.buyBTC(bitApp.startEpoch);
        console.log('buyprie is' + bitApp.BTCPrice);
        bitApp.BTCSellPrice = bitApp.buyBTC(bitApp.endEpoch);
        console.log('sellprice is' + bitApp.BTCSellPrice);
        // bitApp.epochDatesLoop();

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


// Add CommentCollapse 