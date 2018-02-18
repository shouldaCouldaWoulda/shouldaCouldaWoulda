// let bitApp = {};

// bitApp.startEpoch = 0;
// bitApp.endEpoch = 0;
// bitApp.epochGraphIncrement = 0;

// Date.prototype.getUnixTime = function () { return this.getTime() / 1000 | 0 };
// if (!Date.now) Date.now = function () { return new Date(); }

// Date.time = function () { return Date.now().getUnixTime(); }

// bitApp.epochGraph = function () {
//     console.log(bitApp.startEpoch)
//     console.log(bitApp.endEpoch)
//     bitApp.epochGraphIncrement = (bitApp.endEpoch / bitApp.startEpoch);
// };

// bitApp.events = function () {
//     $('form').on('submit', function (e) {
//         e.preventDefault();

//         const buyDateValue = $('#userBuyDate').val();
//         buyDateEpochValue = new Date(buyDateValue).getUnixTime();

//         bitApp.startEpoch = buyDateEpochValue;

//         const sellDateValue = $('#userSellDate').val();

//         sellDateEpochValue = new Date(sellDateValue).getUnixTime();

//         bitApp.endEpoch = sellDateEpochValue;

//         // bitApp.buyAmount = $('#userBuyAmount').val();
//     });
// };

// bitApp.init = function () {
//     bitApp.events();
//     bitApp.epochGraph();
// };

// $(function () {
//     bitApp.init();
// });