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
bitApp.EpochArray = function (buyDateEpochValue, sellDateEpochValue) {
    for (let i = 0; i < numberofEpochPoints.length; i++) {
        epochDates.push(bitApp.startEpoch + (bitApp.epochGraphIncrement * numberofEpochPoints[i]));
    }
    epochDates.push(sellDateEpochValue);
    epochDates.unshift(buyDateEpochValue);
}
const BTCPricesHistory = [];
bitApp.BTCLoop = function () {
    for (let i = 0; i < epochDates.length; i++) {
        bitApp.buyBTC(epochDates[i], epochDates.length);
    }
}
bitApp.buyBTC = (date, originalArray) => {
    let url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD,EUR&ts=${date}`

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
    }).then(function (res) {
        bitApp.buyAmount = $('#userBuyAmount').val();
        res.BTC.date = date;
        BTCPricesHistory.push(res)
        if (originalArray === BTCPricesHistory.length){
           bitApp.startDateData = BTCPricesHistory.filter(BTCPrice => BTCPrice.BTC.date === bitApp.startEpoch)[0];
           bitApp.getNumBitCoins();
        //    undefined????
        }
    });
};

bitApp.getNumBitCoins = function() {
    bitApp.startNumBitcoins = bitApp.buyAmount / bitApp.startDateData.BTC.USD;
    bitApp.getValueThroughTime();
}

bitApp.getValueThroughTime = function() {
    bitApp.valueThroughTime = BTCPricesHistory.map(x => {
        x.totalValue = x.BTC.USD * bitApp.startNumBitcoins;
        return x;
    });
    bitApp.getChartData();
}

bitApp.getChartData = function() {
    bitApp.chartData = bitApp.valueThroughTime.map(item => {
        console.log(item)
        let object = {};
        object.x = new Date(item.BTC.date * 1000);
        object.y = item.totalValue;
        return object;
    });

    bitApp.chartData.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.x) - new Date(b.x);
    });

    // When we map it returns array in the same order
    bitApp.chartLabels = bitApp.chartData.map(item => {
        return item.x;
    });
    bitApp.renderChart();
}



bitApp.events = function () {
    $('form').on('submit', async function (e) {
        e.preventDefault();
        const buyDateValue = $('#userBuyDate').val();
        buyDateEpochValue = new Date(buyDateValue).getUnixTime();
        console.log('buy date', buyDateEpochValue);
        bitApp.startEpoch = await buyDateEpochValue;
        const sellDateValue = $('#userSellDate').val();
        sellDateEpochValue = new Date(sellDateValue).getUnixTime();
        bitApp.endEpoch = await sellDateEpochValue;
        bitApp.epochGraphIncrement = await bitApp.epochGraph(sellDateEpochValue, buyDateEpochValue);
        await bitApp.EpochArray(buyDateEpochValue, sellDateEpochValue);
        bitApp.BTCLoop();
        bitApp.BTCBuyPrice = bitApp.buyBTC(bitApp.startEpoch);
        console.log('buyprie is' + bitApp.BTCPrice);
        bitApp.BTCSellPrice = bitApp.buyBTC(bitApp.endEpoch);
        console.log('sellprice is' + bitApp.BTCSellPrice);
        // bitApp.epochDatesLoop();

        
    });
};

bitApp.renderChart = function() {
    console.log(bitApp.chartData)
    console.log(bitApp.chartLabels)
    
    console.log(bitApp.chartLabels[bitApp.chartLabels.length - 1])
    console.log(bitApp.chartLabels[0])
    bitApp.chartCanvas = $("#myChart");

    bitApp.myLineChart = new Chart(bitApp.chartCanvas, {
        type: 'line',
        data: {
            labels: bitApp.chartLabels,
            datasets: [{
                label: 'Value of BTC',
                data: bitApp.chartData,
                backgroundColor: "rgba(153,255,51,0.4)"
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        displayFormats: {
                            'millisecond': 'MMM DD, YYYY',
                            'second': 'MMM DD, YYYY',
                            'minute': 'MMM DD, YYYY',
                            'hour': 'MMM DD, YYYY',
                            'day': 'MMM DD, YYYY',
                            'week': 'MMM DD, YYYY',
                            'month': 'MMM DD, YYYY',
                            'quarter': 'MMM DD, YYYY',
                            'year': 'MMM DD, YYYY',
                        }
                    }
                }]
            },
        }
    });
}


bitApp.init = function () {
    bitApp.events();
    bitApp.epochGraph();
    // bitApp.buyBTC();
};
$(function () {
    bitApp.init();
});


// Add CommentCollapse 