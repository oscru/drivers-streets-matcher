const getCommunFactors = (a, b) => {
  let counter = 0;
  let largestItem = a > b ? a : b;
  for (let i = 0; i < largestItem; i++) {
    if (i !== 1 && a % i === 0 && b % i === 0) {
      counter++;
    }
  }
  return counter > 0 ? true : false;
};

const multiplier = (street, driver) => {
  const hasCommunFactor = getCommunFactors(street, driver);
  return hasCommunFactor ? 1.5 : 1;
};

export { multiplier };
