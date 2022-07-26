"use strict";
exports.__esModule = true;
exports.multiplier = void 0;
var getCommunFactors = function (a, b) {
    var counter = 0;
    var largestItem = a > b ? a : b;
    for (var i = 0; i < largestItem; i++) {
        if (i !== 1 && a % i === 0 && b % i === 0) {
            counter++;
        }
    }
    return counter > 0 ? true : false;
};
var multiplier = function (street, driver) {
    var hasCommunFactor = getCommunFactors(street, driver);
    return hasCommunFactor ? 1.5 : 1;
};
exports.multiplier = multiplier;
