"use strict";
exports.__esModule = true;
var helpers_1 = require("./helpers");
var nodeReadline = require("readline");
var fs = require("fs");
var vocals = ["a", "e", "i", "o", "u"];
var SSinterface = nodeReadline.createInterface(process.stdin, process.stdout);
var drivers, streets, data;
//Calculate the SS of each driver in each street then return the drivers with the highest SS
var calculateSS = function (street, base, type) {
    var streetLength = street.length;
    var scores = drivers.map(function (driver) {
        // Get the SS of each driver
        var driverLetters = driver.replace(" ", "").split("");
        var multiplierBase = (0, helpers_1.multiplier)(streetLength, driverLetters.length); // Get the multiplier base
        var SS = 0;
        driverLetters.forEach(function (letter) {
            // Get the puntuation of each letter (consonant or vocal) and add it to the SS
            if (type === "odd") {
                !vocals.includes(letter) && (SS = SS + 1 * base);
            }
            else {
                vocals.includes(letter) && (SS = SS + 1 * base);
            }
        });
        return {
            driver: driver,
            SS: SS * multiplierBase
        };
    });
    return scores;
};
//Sort all drivers by his highest SS in all streets
var sortDriversSS = function (calculatedSS) {
    var sortedDrivers = [];
    var _loop_1 = function (i) {
        var highestSS = calculatedSS.map(function (drivers, index) {
            // Get the highest SS in each street
            return {
                street: calculatedSS[index].street,
                driver: drivers.driverSS[i]
            };
        });
        highestSS.sort(function (a, b) { return b.driver.SS - a.driver.SS; }); // Sort the highest SS in each street
        highestSS.forEach(function (item) {
            // Get the driver with the highest SS in each street
            if (sortedDrivers.length > 0) {
                if (sortedDrivers.find(function (x) { return x.street === item.street; })) {
                    // If the street already exists in the array
                    if (sortedDrivers.find(function (x) { return x.driver.SS < item.driver.SS; })) {
                        // If the driver has a higher SS than the last one
                        sortedDrivers.splice(
                        // Remove the last one
                        sortedDrivers.indexOf(sortedDrivers.find(function (x) { return x === item; })), 1);
                        sortedDrivers.push(item);
                    }
                }
                else {
                    if (sortedDrivers.find(function (x) { return x.driver.driver === item.driver.driver; }) // If the driver already exists in the array
                    ) {
                        if (sortedDrivers.find(function (x) { return x.driver.SS < item.driver.SS; })) {
                            sortedDrivers.splice(sortedDrivers.indexOf(sortedDrivers.find(function (x) { return x === item; })), 1);
                            sortedDrivers.push(item);
                        }
                    }
                    else {
                        sortedDrivers.push(item);
                    }
                }
            }
            else {
                sortedDrivers.push(item);
            }
        });
    };
    for (var i = 0; i < calculatedSS.length; i++) {
        _loop_1(i);
    }
    return sortedDrivers.map(function (sortedDriver) { return ({
        street: sortedDriver.street,
        driver: sortedDriver.driver.driver,
        SS: sortedDriver.driver.SS
    }); });
};
var getDriverSS = function (street) {
    street = street.replace(" ", "");
    var driversScore, base, type;
    if (street.length % 2 !== 0) {
        driversScore = calculateSS(street, (base = 1), (type = "odd"));
    }
    else {
        driversScore = calculateSS(street, (base = 1.5), (type = "even"));
    }
    driversScore.sort(function (a, b) { return b.SS - a.SS; });
    return driversScore;
};
//Print the data table with the drivers and their SS
var dataTable = function (data) {
    var tableStreets = data.map(function (item) {
        var tableData = {};
        tableData["street"] = item.street;
        item.driverSS.forEach(function (driver, i) {
            tableData[item.driverSS[i].driver] = item.driverSS[i].SS;
        });
        return tableData;
    });
    console.table(tableStreets);
};
//Print the data in console, with the highest SS in each street
var toggleCalculateSS = function () {
    var calculatedSS = streets.map(function (street) {
        var driverSS = getDriverSS(street);
        return {
            street: street,
            driverSS: driverSS
        };
    });
    data = calculatedSS;
    console.log(sortDriversSS(calculatedSS));
};
var interfaceSSCalculator = function () {
    SSinterface.question("Please write the route to the drivers file: ", function (route) {
        var fetchingDrivers, fetchingStreets;
        if (route) {
            try {
                fetchingDrivers = fs.readFileSync(route, "utf8");
            }
            catch (err) {
                throw err;
            }
            drivers = JSON.parse(fetchingDrivers).content; // Get the drivers
        }
        else {
            interfaceSSCalculator();
        }
        SSinterface.question("Please write the route to the streets file: ", function (route) {
            if (route) {
                try {
                    fetchingStreets = fs.readFileSync(route, "utf8");
                }
                catch (err) {
                    throw err;
                }
                streets = JSON.parse(fetchingStreets).content; // Get the streets
            }
            else {
                interfaceSSCalculator();
            }
            toggleCalculateSS();
            SSinterface.question("If you want to see the complete data table please type 'data'. To leave the program type 'exit': ", function (option) {
                if (option) {
                    switch (option) {
                        case "data":
                            dataTable(data);
                            SSinterface.close();
                            break;
                        case "exit":
                            SSinterface.close();
                            break;
                        default:
                            SSinterface.close();
                            break;
                    }
                }
            });
        });
    });
};
interfaceSSCalculator();
