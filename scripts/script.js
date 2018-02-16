

const bitApp = {};

Date.prototype.getUnixTime = function () { return this.getTime() / 1000 | 0 };
    if (!Date.now) Date.now = function () { return new Date(); }
    Date.time = function () { return Date.now().getUnixTime(); }

bitApp.getWorth = (epochDate) => {
    return $.ajax({
    url: `https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD,EUR&ts=${epochDate}`,
        method: 'GET',
        dataType: 'json'
    });
};

bitApp.events = function() {
    $('form').on('submit', function (e) {
        e.preventDefault();
        const buyValue = $('#userStartDate').val();
        buyDate = new Date(buyValue).getUnixTime();
        console.log(buyDate);
        bitApp.getWorth(buyDate);
    });
}

bitApp.init = function() {
    bitApp.events();
};

$(function () {
    bitApp.init();
});


bitApp.getWorth = (buyDate) => {
    let url = `https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD,EUR&ts=${buyDate}`
    console.log(url);
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
    }).then (function(res){
        console.log(res);

        let dollars1 = res.BTC.USD;
        console.log(dollars1);

        playingWithMoney(dollars1);
    });
};
console.log(bitApp.getWorth(buyDate));

const playingWithMoney = (dollars1, dollars2) => {
    const finalValue = dollars1 - dollars2;
    console.log(finalValue);
};

