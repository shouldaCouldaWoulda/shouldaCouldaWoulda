

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

// MATRIX BACKGROUND BEGINS
bitApp.canvas = document.getElementById("canvas");
bitApp.ctx = bitApp.canvas.getContext("2d");

//making the canvas full screen
bitApp.canvas.height = window.innerHeight;
bitApp.canvas.width = window.innerWidth;

//chinese characters - taken from the unicode charset
bitApp.numbers = "1234567890";
//converting the string into an array of single characters
bitApp.numbers = bitApp.numbers.split("");

bitApp.font_size = 20;
bitApp.columns = bitApp.canvas.width / bitApp.font_size; //number of columns for the rain
//an array of drops - one per column
bitApp.drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
for (let x = 0; x < bitApp.columns; x++)
    bitApp.drops[x] = 1;

// drawing the characters
bitApp.draw = function () {
    //Black BG for the canvas
    //translucent BG to show trail
    bitApp.ctx.fillStyle = "rgba(220,220,220,.05)";
    bitApp.ctx.fillRect(0, 0, bitApp.canvas.width, bitApp.canvas.height);

    bitApp.ctx.fillStyle = "rgba(255, 255, 255, 1)"; //green text
    bitApp.ctx.font = bitApp.font_size + "px arial";
    //looping over drops
    for (let i = 0; i < bitApp.drops.length; i++) {
        //a random chinese character to print
        bitApp.text = bitApp.numbers[Math.floor(Math.random() * bitApp.numbers.length)];
        //x = i*font_size, y = value of drops[i]*font_size
        bitApp.ctx.fillText(bitApp.text, i * bitApp.font_size, bitApp.drops[i] * bitApp.font_size);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if (bitApp.drops[i] * bitApp.font_size > bitApp.canvas.height && Math.random() > 0.975)
            bitApp.drops[i] = 0;

        //incrementing Y coordinate
        bitApp.drops[i]++;
    }
}
setInterval(bitApp.draw, 33);
// MATRIX BACKGROUND ENDS


bitApp.coinRotation = function () {
    //initial fade-in time (in milliseconds)
    let initialFadeIn = 0;

    //interval between items (in milliseconds)
    let itemInterval = 100;

    //cross-fade time (in milliseconds)
    let fadeTime = 0;

    //count number of items
    let numberOfItems = $('.rotating-item').length;

    //set current item
    let currentItem = 0;

    //show first item
    $('.rotating-item').eq(currentItem).fadeIn(initialFadeIn);

    //loop through the items
    let infiniteLoop = setInterval(function () {
        $('.rotating-item').eq(currentItem).fadeOut(fadeTime);

        if (currentItem == numberOfItems - 1) {
            currentItem = 0;
        } else {
            currentItem++;
        }
        $('.rotating-item').eq(currentItem).fadeIn(fadeTime);

    }, itemInterval);
}

bitApp.init = function () {
    bitApp.events();
    bitApp.purchasedBTC();
    bitApp.epochGraph();
    bitApp.draw();
    bitApp.coinRotation();
};

$(function () {
    bitApp.init();
});