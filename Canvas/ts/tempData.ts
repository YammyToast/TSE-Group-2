import { DataMaximumValues, DataYearAveragesInstance, DataYearAverages, DataYearMonthValues, DataMonthValues, Country } from "./api.js";

export const maximumValues: DataMaximumValues = {
    min_rainfall: 5.1,
    max_rainfall: 23.1,
    min_sunshine: 31.6,
    max_sunshine: 238.0,
    min_lowTemp: -1.1,
    max_lowTemp: 12.8,
    min_highTemp: 4.4,
    max_highTemp: 24
};

export const yearAverages1910: DataYearAveragesInstance = {
  en: { highTemp: 12.0, lowTemp: 5.0, rainfall: 12.0, sunshine: 114.0 },
  ni: { highTemp: 11.0, lowTemp: 4.0, rainfall: 17.0, sunshine: 109.0 },
  sc: { highTemp: 10.0, lowTemp: 3.0, rainfall: 16.0, sunshine: 100.0 },
  wa: { highTemp: 11.0, lowTemp: 5.0, rainfall: 16.0, sunshine: 112.0 },
  year: 1910
};



export const fullYearValues: DataYearMonthValues = {
  country: Country.en,
  highTemp: {
    apr: 15.6,
    aug: 21.7,
    dec: 7.4,
    feb: 9.3,
    jan: 8.8,
    jul: 20.0,
    jun: 19.5,
    mar: 10.4,
    may: 18.1,
    nov: 11.5,
    oct: 13.4,
    sep: 18.6,
  },
  lowTemp: {
    apr: 4.8,
    aug: 13.1,
    dec: 2.2,
    feb: 3.0,
    jan: 3.5,
    jul: 11.3,
    jun: 10.4,
    mar: 2.5,
    may: 6.6,
    nov: 5.3,
    oct: 7.2,
    sep: 9.3,
  },
  rainfall: {
    apr: 5.1,
    aug: 13.0,
    dec: 19.1,
    feb: 19.7,
    jan: 11.4,
    jul: 11.4,
    jun: 13.8,
    mar: 9.3,
    may: 2.3,
    nov: 12.0,
    oct: 19.7,
    sep: 7.4,
  },
  sunshine: {
    apr: 236.7,
    aug: 160.8,
    dec: 45.5,
    feb: 79.3,
    jan: 56.0,
    jul: 166.0,
    jun: 181.9,
    mar: 156.5,
    may: 299.4,
    nov: 60.7,
    oct: 68.1,
    sep: 165.4,
  },
  year: 2020,
};
