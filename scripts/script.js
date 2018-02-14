


const bitApp = {};

Date.prototype.getUnixTime = function () { return this.getTime() / 1000 | 0 };
    if (!Date.now) Date.now = function () { return new Date(); }
    Date.time = function () { return Date.now().getUnixTime(); }

// user input date needs to be passed into below
bitApp.someDate = new Date('25 Dec 1995');
    var theUnixTime = bitApp.someDate.getUnixTime();
    console.log(theUnixTime);


bitApp.getWorth = (epochDate) => {
    return $.ajax({
    url: `https://min-api.cryptocompare.com/data/pricehistorical?fsym=BTC&tsyms=USD,EUR&ts=${epochDate}`,
        method: 'GET',
        dataType: 'json'
    });
};

bitApp.getData = async function () {
    const answer = await bitApp.getWorth(1452680400);
    console.log(answer);
};

bitApp.init = function() {
    bitApp.getData();
};

$(function () {
    bitApp.init();
});