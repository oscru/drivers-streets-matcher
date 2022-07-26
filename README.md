# Drivers Streets Matcher

Matcher of 2 input files data, making a conversion and assigning each shipment destination to a driver maximizing the total suitability of all shipments to all drivers.

## Rules
- If the length of the shipment's destination street name is even, the base suitability score (SS) is the number of vowels in the driver’s name multiplied by 1.5.

- If the length of the shipment's destination street name is odd, the base SS is the number of consonants in the driver’s name multiplied by 1.

- If the length of the shipment's destination street name shares any common factors (besides 1) with the length of the driver’s name, the
SS is increased by 50% above the base SS.

## About
The main file has been written on [typescript](https://www.typescriptlang.org/). Install typescript and run:
```bash
tsc main.ts
```
To edit and transpile the main file.

## Running

Use [node](https://pip.pypa.io/en/stable/) (v16 or superior) to run Drivers Streets Matcher.

```bash
node main
```

## Usage
Once you run the program will be able to input two file routes, one for the drivers and the other for the streets. These files will have the next structure.
```javascript
{
  "content": ["your data here..."]
}
```
The system will do the calculations and then returns the values with the highest relations with the data previously input with the next structure.
```javascript
[
  {
    street: 'Street 1',
    driver: 'Driver 1',
    SS: 13.5
  },
  {
    street: 'Street 2',
    driver: 'Driver 2',
    SS: 10
  },
  {
    street: 'Street 3',
    driver: 'Driver 3',
    SS: 6.75
  },
]
```


## License
[MIT](https://choosealicense.com/licenses/mit/)
