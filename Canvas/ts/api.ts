
//sunshine 1910
//temphigh 1884
//templow 1884
//rainfall 1891

/**
 * @brief Constant values for the year boundaries of the dataset.
 */
export const YEARRANGE = {
    low: 1910,
    high: 2022
} as const

/**
 * @brief Semi-constant values that define the range for each data type across the whole dataset.
 * @param min_rainfall Minimum value for rainfall across the whole dataset.
 * @param max_rainfall Maximum vlaue for rainfall across the whole dataset.
 * @param min_sunshine ...
 * @param max_sunshine ... 
 */
export interface DataMaximumValues {
    min_rainfall: number,
    max_rainfall: number,
    min_sunshine: number,
    max_sunshine: number,
    min_lowTemp: number,
    max_lowTemp: number,
    min_highTemp: number,
    max_highTemp: number,

}

/**
 * @brief Compound data object. Stores the yearly average for a single year, for all data types, for all countries
 * @param en Data-object for the corresponding data of England.
 * @param sc ...
 */
export interface DataYearAveragesInstance {
    en: DataYearAverages,
    sc: DataYearAverages,
    wa: DataYearAverages,
    ni: DataYearAverages,
    year: number
}

/**
 * @brief Yearly average values for all data types for a single country.
 * @param rainfall Yearly average for rainfall for the associated year.
 * @param sunshine Yearly average for sunshine for the associated year.
 * @param ...
 */
export interface DataYearAverages {
    rainfall: number,
    sunshine: number,
    lowTemp: number,
    highTemp: number
} 

/**
 * @brief Enumeration of all possible country identifiers.
 */
export enum Country {
    en = 0,
    sc = 1,
    wa = 2,
    ni = 3
}

/**
 * @brief Data object to hold number for a single data type over a year.
 * @param jan: number | null.
 * @param feb: number | null.
 * @param ... for months jan -> dec
 */
export interface DataMonthValues {
    jan: number | null,
    feb: number | null,
    mar: number | null,
    apr: number | null,
    may: number | null,
    jun: number | null,
    jul: number | null,
    aug: number | null,
    sep: number | null,
    oct: number | null,
    nov: number | null,
    dec: number | null,
}

/**
 * @brief Compound data object. Stores data for 12 months worth of each data type i.e., rainfall, for a single country.
 * @param year Year of which the data corresponds to. Used for organising the cache.
 * @param country Country of which the data corresponds to.
 * @param rainfall Number values for the rainfall for all 12 months of the year.
 * @param sunshine See rainfall..
 * @param ...
 */
export interface DataYearMonthValues {
    year: number,
    country: Country,
    rainfall: DataMonthValues,
    sunshine: DataMonthValues,
    lowTemp: DataMonthValues,
    highTemp: DataMonthValues
}