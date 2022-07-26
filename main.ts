import { multiplier } from "./helpers";

const nodeReadline = require("readline");
const fs = require("fs");
const vocals: string[] = ["a", "e", "i", "o", "u"];

var SSinterface = nodeReadline.createInterface(process.stdin, process.stdout);
var drivers: string[], streets: string[], data: calculatedSS[];

interface highestSS {
  street: string;
  driver: driver;
}

interface driver {
  driver: string;
  SS: number;
}

interface calculatedSS {
  street: string;
  driverSS: driver[];
}
interface calculatedDriverSS {
  street: string;
  driver: driver;
}
interface sortedDriver {
  street: string;
  driver: string;
  SS: number;
}

const calculateSS = (street: string, base: number, type: string): driver[] => {
  let streetLength: number = street.length;
  const scores: driver[] = drivers.map((driver: string): driver => {
    let driverLetters = driver.replace(" ", "").split("");
    let multiplierBase = multiplier(streetLength, driverLetters.length);
    let SS = 0;
    driverLetters.forEach((letter) => {
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

const sortDriversSS = (calculatedSS: calculatedSS[]): sortedDriver[] => {
  let sortedDrivers = [];
  for (let i = 0; i < calculatedSS.length; i++) {
    let highestSS: highestSS[] = calculatedSS.map((drivers, index) => {
      return {
        street: calculatedSS[index].street,
        driver: drivers.driverSS[i],
      };
    });
    highestSS.sort((a, b) => b.driver.SS - a.driver.SS);
    highestSS.forEach((item) => {
      if (sortedDrivers.length > 0) {
        if (sortedDrivers.find((x) => x.street === item.street)) {
          if (sortedDrivers.find((x) => x.driver.SS < item.driver.SS)) {
            sortedDrivers.splice(
              sortedDrivers.indexOf(sortedDrivers.find((x) => x === item)),
              1
            );
            sortedDrivers.push(item);
          }
        } else {
          if (
            sortedDrivers.find((x) => x.driver.driver === item.driver.driver)
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
    (sortedDriver: calculatedDriverSS): sortedDriver => ({
      street: sortedDriver.street,
      driver: sortedDriver.driver.driver,
      SS: sortedDriver.driver.SS,
    })
  );
};

const getDriverSS = (street: string) => {
  street = street.replace(" ", "");
  let driversScore: driver[], base: number, type: string;
  if (street.length % 2 !== 0) {
    driversScore = calculateSS(street, (base = 1), (type = "odd"));
  } else {
    driversScore = calculateSS(street, (base = 1.5), (type = "even"));
  }
  driversScore.sort((a, b) => b.SS - a.SS);
  return driversScore;
};

const dataTable = (data: calculatedSS[]) => {
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

const toggleCalculateSS = () => {
  const calculatedSS: calculatedSS[] = streets.map((street: string) => {
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
        drivers = JSON.parse(fetchingDrivers).content;
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
            streets = JSON.parse(fetchingStreets).content;
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
