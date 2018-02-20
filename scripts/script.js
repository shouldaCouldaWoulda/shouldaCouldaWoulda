let bitApp = {};

// MATRIX BACKGROUND BEGINS
bitApp.buildMatrix = function(){
    canvas = document.getElementById("matrix");
    matrix = canvas.getContext("2d");
    //making the canvas full screen
// THERE HAS TO BE A BETTER WAY TO SIZE THIS AND MAKE IT RESIZE UPON RESIZING THE BROWSER...
    canvas.height = 1.5*window.innerHeight;
    canvas.width = window.innerWidth;
    numbers = "1234567890";
    //converting the string into an array of single characters
    numbers = numbers.split("");
    font_size = 20;
    columns = canvas.width / font_size; //number of columns for the rain
    //an array of drops - one per column
    drops = [];
    //x below is the x coordinate
    //1 = y co-ordinate of the drop(same for every drop initially)
    for (let x = 0; x < columns; x++)
        drops[x] = 1;
    // drawing the characters
    bitApp.draw = function () {
        //translucent BG to show trail
        matrix.fillStyle = "rgba(220,220,220,.05)";
        matrix.fillRect(0, 0, canvas.width, canvas.height);
        matrix.fillStyle = "rgba(255, 255, 255, 1)"; //white text
        matrix.font = font_size + "px arial";
        //looping over drops
        for (let i = 0; i < drops.length; i++) {
            //a random chinese character to print
            text = numbers[Math.floor(Math.random() * numbers.length)];
            //x = i*font_size, y = value of drops[i]*font_size
            matrix.fillText(text, i * font_size, drops[i] * font_size);
            //sending the drop back to the top randomly after it has crossed the screen
            //adding a randomness to the reset to make the drops scattered on the Y axis
            if (drops[i] * font_size > canvas.height && Math.random() > 0.975)
                drops[i] = 0;
            //incrementing Y coordinate
            drops[i]++;
        }
    }
    setInterval(bitApp.draw, 33);
};
// MATRIX BACKGROUND ENDS


// COIN ANIMATION BEGINS
bitApp.coinRotation = function () {
    //initial fade-in time (in milliseconds)
    let initialFadeIn = 0;
    //interval between items (in milliseconds)
    let itemInterval = 100;
    //cross-fade time (in milliseconds)
    let fadeTime = 0;
    //count number of items
    let numberOfItems = $('.rotating_coin').length;
    //set current item
    let currentItem = 0;
    //show first item
    $('.rotating_coin').eq(currentItem).fadeIn(initialFadeIn);
    //loop through the items
    let infiniteLoop = setInterval(function () {
        $('.rotating_coin').eq(currentItem).fadeOut(fadeTime);
        if (currentItem == numberOfItems - 1) {
            currentItem = 0;
        } else {
            currentItem++;
        }
        $('.rotating_coin').eq(currentItem).fadeIn(fadeTime);
    }, itemInterval);
}
// COIN ANIMATION ENDS


// SETTING THE DATE INPUT MAX TO CURRENT DAY
// HOW DO I SET REQUIREMENT THAT THE SELL DATE BE AFTER THE BUY DATE? JQUERY DATEPICKER?
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1; //January is 0!
let yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}
today = yyyy + '-' + mm + '-' + dd;
document.getElementById("userBuyDate").setAttribute("max", today);
document.getElementById("userSellDate").setAttribute("max", today);
// SETTING THE DATE INPUT MAX TO CURRENT DAY, AND SELL DATE TO AFTER BUY DATE ENDS


// DATE TO UNIX TIME BEGINS
Date.prototype.getUnixTime = function () { return this.getTime() / 1000 | 0 };
if (!Date.now) Date.now = function () { return new Date(); }
Date.time = function () { return Date.now().getUnixTime(); }
// DATE TO UNIX TIME ENDS


// GETTING POINTS TO GRAPH BEGINS
bitApp.startEpoch = 0;
bitApp.endEpoch = 0;
bitApp.epochGraphIncrement = 0;
bitApp.BTCBuyPrice = 0;
bitApp.BTCSellPrice = 0;
bitApp.epochGraph = function (end, start) {
    return (end - start) / 10;
};

// getting the starting and ending epoch dates AND hidding first page for results
bitApp.events = function () {
    $('form').on('submit', async function (e) {
        e.preventDefault();
        bitApp.buyDateValue = $('#userBuyDate').val();
        buyDateEpochValue = new Date(bitApp.buyDateValue).getUnixTime();
        bitApp.startEpoch = await buyDateEpochValue;
        bitApp.sellDateValue = $('#userSellDate').val();
        sellDateEpochValue = new Date(bitApp.sellDateValue).getUnixTime();
        bitApp.endEpoch = await sellDateEpochValue;
        bitApp.epochGraphIncrement = await bitApp.epochGraph(sellDateEpochValue, buyDateEpochValue);
        await bitApp.EpochArray(buyDateEpochValue, sellDateEpochValue);
        bitApp.BTCLoop();
        $('.form_wrapper').toggleClass('hidden')
        $('svg').toggleClass('hidden')
        $('header').addClass('hidden')

    });

};
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
           bitApp.getStartNumBitCoins();
        }
    });
};
bitApp.getStartNumBitCoins = function() {
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
    bitApp.finalPortfolioWorth = Math.floor(bitApp.chartData[9].y)

    // When we map it returns array in the same order
    bitApp.chartLabels = bitApp.chartData.map(item => {
        return item.x;
    });
    bitApp.renderChart();
    bitApp.appendResults();
}
// GETTING POINTS TO GRAPH ENDS


// MAKING POPUP TO DISPLAY RESULTS BEGINS
$('.form').on('submit', function (event) {
    event.preventDefault();
    $('.hidden').toggleClass('hidden');
});
// MAKING POPUP ENDS


// APPENDING FINAL PORTFOLIO VALUE TO THE PAGE
bitApp.appendResults = function() {
    $("#results").append(`<p>${bitApp.buyAmount}$ (USD) invested on ${bitApp.buyDateValue}</p><p>would have been worth ${bitApp.finalPortfolioWorth}$ (USD) on ${bitApp.sellDateValue}</p>`);
}
// APPENDING FIMAL PORTFOLIO VALUE TO THE PAGE


// RENDERING CHART BEGINS
bitApp.renderChart = function () {
    bitApp.chartCanvas = $("#chart");
    bitApp.myLineChart = new Chart(bitApp.chartCanvas, {
        type: 'line',
        data: {
            labels: bitApp.chartLabels,
            datasets: [{
                label: 'value of portfolio (USD)',
                data: bitApp.chartData,
                backgroundColor: "rgb(255, 196, 20, 0.4)"
            }]
        },
        options: {
            // responsive: false,
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
// RENDERING CHART ENDS


// PLAY AGAIN BEGINS
bitApp.newGame = function () {
    $('.new_game').on('click', function() {
        location.reload();
    });
}
// PLAY AGAIN ENDS

bitApp.init = function () {
    bitApp.events();
    bitApp.epochGraph();
    bitApp.coinRotation();
    bitApp.buildMatrix();
    bitApp.newGame();
};

$(function () {
    bitApp.init();
});