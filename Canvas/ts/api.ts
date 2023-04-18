
//sunshine 1910
//temphigh 1884
//templow 1884
//rainfall 1891

export const YEARRANGE = {
    low: 1910,
    high: 2022
} as const

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

export interface DataYearAveragesInstance {
    en: DataYearAverages,
    sc: DataYearAverages,
    wa: DataYearAverages,
    ni: DataYearAverages
}

export interface DataYearAverages {
    rainfall: number,
    sunshine: number,
    lowTemp: number,
    highTemp: number
} 

export interface DataYearMonthValues {
    
}