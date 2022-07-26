export interface highestSS {
    street: string;
    driver: driver;
  }
  
  export interface driver {
    driver: string;
    SS: number;
  }
  
  export interface calculatedSS {
    street: string;
    driverSS: driver[];
  }
  export interface calculatedDriverSS {
    street: string;
    driver: driver;
  }
  export interface sortedDriver {
    street: string;
    driver: string;
    SS: number;
  }