import { multiplier } from "./helpers";
import * as types from "./types";
const nodeReadline = require("readline");
const fs = require("fs");
const vocals: string[] = ["a", "e", "i", "o", "u"];

var SSinterface = nodeReadline.createInterface(process.stdin, process.stdout);
var drivers: string[], streets: string[], data: types.calculatedSS[];

//Calculate the SS of each driver in each street then return the drivers with the highest SS
const calculateSS = (street: string, base: number, type: string): types.driver[] => {
  let streetLength: number = street.length;
  const scores: types.driver[] = drivers.map((driver: string): types.driver => {
    // Get the SS of each driver
    let driverLetters = driver.replace(" ", "").split("");
    let multiplierBase = multiplier(streetLength, driverLetters.length); // Get the multiplier base
    let SS = 0;
    driverLetters.forEach((letter) => {
      // Get the puntuation of each letter (consonant or vocal) and add it to the SS
      if (type === "odd") {
        !vocals.includes(letter) && (SS = SS + 1 * base);
      } else {
        vocals.includes(letter) && (SS = SS + 1 * base);
      }
    });
    return {
      driver,
      SS: SS * multiplierBase,
    };
  });
  return scores;
};

//Sort all drivers by his highest SS in all streets
const sortDriversSS = (calculatedSS: types.calculatedSS[]): types.sortedDriver[] => {
  let sortedDrivers = [];
  for (let i = 0; i < calculatedSS.length; i++) {
    let highestSS: types.highestSS[] = calculatedSS.map((drivers, index) => {
      // Get the highest SS in each street
      return {
        street: calculatedSS[index].street,
        driver: drivers.driverSS[i],
      };
    });
    highestSS.sort((a, b) => b.driver.SS - a.driver.SS); // Sort the highest SS in each street
    highestSS.forEach((item) => {
      // Get the driver with the highest SS in each street
      if (sortedDrivers.length > 0) {
        if (sortedDrivers.find((x) => x.street === item.street)) {
          // If the street already exists in the array
          if (sortedDrivers.find((x) => x.driver.SS < item.driver.SS)) {
            // If the driver has a higher SS than the last one
            sortedDrivers.splice(
              // Remove the last one
              sortedDrivers.indexOf(sortedDrivers.find((x) => x === item)),
              1
            );
            sortedDrivers.push(item);
          }
        } else {
          if (
            sortedDrivers.find((x) => x.driver.driver === item.driver.driver) // If the driver already exists in the array
          ) {
            if (sortedDrivers.find((x) => x.driver.SS < item.driver.SS)) {
              sortedDrivers.splice(
                sortedDrivers.indexOf(sortedDrivers.find((x) => x === item)),
                1
              );
              sortedDrivers.push(item);
            }
          } else {
            sortedDrivers.push(item);
          }
        }
      } else {
        sortedDrivers.push(item);
      }
    });
  }
  return sortedDrivers.map(
    (sortedDriver: types.calculatedDriverSS): types.sortedDriver => ({
      street: sortedDriver.street,
      driver: sortedDriver.driver.driver,
      SS: sortedDriver.driver.SS,
    })
  );
};

const getDriverSS = (street: string) => {
  street = street.replace(" ", "");
  let driversScore: types.driver[], base: number, type: string;
  if (street.length % 2 !== 0) {
    driversScore = calculateSS(street, (base = 1), (type = "odd"));
  } else {
    driversScore = calculateSS(street, (base = 1.5), (type = "even"));
  }
  driversScore.sort((a, b) => b.SS - a.SS);
  return driversScore;
};

//Print the data table with the drivers and their SS
const dataTable = (data: types.calculatedSS[]) => {
  let tableStreets = data.map((item) => {
    const tableData = {};
    tableData["street"] = item.street;
    item.driverSS.forEach((driver, i) => {
      tableData[item.driverSS[i].driver] = item.driverSS[i].SS;
    });
    return tableData;
  });
  console.table(tableStreets);
};
//Print the data in console, with the highest SS in each street
const toggleCalculateSS = () => {
  const calculatedSS: types.calculatedSS[] = streets.map((street: string) => {
    let driverSS = getDriverSS(street);
    return {
      street,
      driverSS,
    };
  });
  data = calculatedSS;
  console.log(sortDriversSS(calculatedSS));
};

const interfaceSSCalculator = () => {
  SSinterface.question(
    "Please write the route to the drivers file: ",
    function (route: string) {
      let fetchingDrivers, fetchingStreets;
      if (route) {
        try {
          fetchingDrivers = fs.readFileSync(route, "utf8");
        } catch (err) {
          throw err;
        }
        drivers = JSON.parse(fetchingDrivers).content; // Get the drivers
      } else {
        interfaceSSCalculator();
      }
      SSinterface.question(
        "Please write the route to the streets file: ",
        (route: string) => {
          if (route) {
            try {
              fetchingStreets = fs.readFileSync(route, "utf8");
            } catch (err) {
              throw err;
            }
            streets = JSON.parse(fetchingStreets).content; // Get the streets
          } else {
            interfaceSSCalculator();
          }
          toggleCalculateSS();
          SSinterface.question(
            "If you want to see the complete data table please type 'data'. To leave the program type 'exit': ",
            (option) => {
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
            }
          );
        }
      );
    }
  );
};

interfaceSSCalculator();
