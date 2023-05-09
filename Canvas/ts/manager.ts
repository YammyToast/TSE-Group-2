import { Controller } from './controller.js'
import { YEARRANGE, DataYearAverages, DataYearAveragesInstance, DataMaximumValues, DataYearMonthValues, DataMonthValues, Country } from './api.js'
import { COLOURSLIGHT, ViewTypes } from './config.js';

import { maximumValues, yearAverages, fullYearValues} from './tempData.js';


/**
 * Data Abstraction layer for the canvas.
 * Maintains records of data requests made to the server.
 * Includes making AJAX requests as well as caching made requests.
 * Handles a single Canvas instance through a provided controller.
 */
export class Manager {
    // Controller through which the Manager interacts with it's canvas.
    controller: Controller;
    // Year Selected by the Canvas.
    dataSelectedYear: number;
    // Maximum values of the dataset used.
    // Used in determining colours for map renders.
    dataMaximumValues: DataMaximumValues
    // Storage of requests made for YearAverages.
    // Each Instance holds 4 DataYearAverages, 
    // each of which holds the 4 datatypes for each country.
    dataYearAveragesCache: Map<number, DataYearAveragesInstance>
    // Storage of requests made for full year-month values.

    dataFullYearValuesCache: Map<[number, Country], DataYearMonthValues>
    /**
     * Constructor for a Manager. Requires dependency injection of a Pre-loaded Controller / Canvas.
     * @param _controller Pre-initalized Controller instance.
     */
    constructor(_controller: Controller) {
        this.controller = _controller;
        // Bind callback function for controller instance to a method of this class.
        this.controller.managerChangeCallback = this.activeChangeCallback;
        // Initialize Cache map.
        this.dataYearAveragesCache = new Map();
        this.dataSelectedYear = 1943;
    }
    /**  
     * Makes a request for the maximum data values of the dataset.
     * Used to test connectivity to the server during canvas intializiation. 
    */
    getMaximumValues(): boolean {
        try {
            // Make AJAX Request to maxValues route.
            $.get('https://harrysmith.dev/api/data_max_values', (data) => {
                // Data validation to check success of request.
                if(!data || Object.keys(data).length == 0) return false;
                // do a bit of parsing.
                this.dataMaximumValues = data;
            })

        } catch(error) {
            console.log(error);
            this.dataMaximumValues = maximumValues;
            return false;
        }
    }
    /**
     * Requests all the averages, of all the datatypes,
     * for a single year.
     * @param _year Year of the data to request.
     * @returns yearAverageInstance, containing parsed data for the year,
     * or null if the request failed.
     */
    getYearAverage(_year: number): DataYearAveragesInstance | null {
        try {
            // Make AJAX Request to yearAverages route, passing in the year as a parameter.
            $.get(`https://harrysmith.dev/api/data_year_averages?year=${_year}`, (data) => {
                // Data validation to check success of request.
                if(!data || Object.keys(data).length == 0) return false;
                // do a bit of parsing.
                return {

                } as DataYearAverages
            })
        } catch(error) {
            console.log(error);
            return null
        }
    }
    /**
     * Requests all the averages, of all the datatypes,
     * for a single year.
     * @param _year Year of the data to request.
     * @returns yearAverageInstance, containing parsed data for the year,
     * or null if the request failed.
     */
    getFullYearValues(_year: number, _country: string): DataYearAveragesInstance | null {
        try {
            // Make AJAX Request to yearAverages route, passing in the year as a parameter.
            $.get(`https://harrysmith.dev/api/data_full_year_values?year=${_year}&country=${_country}`, (data) => {
                // Data validation to check success of request.
                if(!data || Object.keys(data).length == 0) return false;
                // do a bit of parsing.
                return {

                } as DataYearAverages
            })
        } catch(error) {
            console.log(error);
            return null
        }
    }
    /**
     * Handles event of the selected year being changed by the user.
     * Makes an API request then calls for render of the currently selected view.
     * @param _year Year selected by the user.
     * @returns Void.
     */
    handleYearSelection(_year: number) {
        try {
            // If the selected year is the same as previously, do nothing.
            if(this.dataSelectedYear == _year) return;
            // Account for data 5 years either side of the selected year.
            for(let it = _year - 5; it < _year + 5; it++) {
                // If Year is out of bounds for the dataset, skip.
                // If data for the Year has already been requested, skip.
                if(_year < YEARRANGE.low || _year > YEARRANGE.high || this.dataYearAveragesCache.has(_year)) continue;
                // API Request function.
                let data = this.getYearAverage(_year)
                // Add Data to Storage.
                this.dataYearAveragesCache.set(_year, data);
            }

            // Set selected year value for previous check.
            this.dataSelectedYear = _year;
            let low: number, high: number;
            // Set basis for data intensity of selected year based on view.
            // Intensity is where the data sits between the maximum and minimum values.
            switch(this.controller.viewActive) {
                case ViewTypes.rainfall:
                    low = this.dataMaximumValues.min_rainfall;
                    high = this.dataMaximumValues.max_rainfall;
                    break;
                case ViewTypes.sunshine:
                    low = this.dataMaximumValues.min_sunshine;
                    high = this.dataMaximumValues.max_sunshine;
                    break;
                case ViewTypes.lowTemp:
                    low = this.dataMaximumValues.min_lowTemp;
                    high = this.dataMaximumValues.max_lowTemp;
                    break;
                case ViewTypes.highTemp:
                    low = this.dataMaximumValues.min_highTemp;
                    high = this.dataMaximumValues.max_highTemp;
                    break;
            }
            // Call for the rendering of the respective years data on the canvas.
            // Data is pulled from the storage map, and a colour scheme is passed.
            // Intensity is calculated in the render function.
            this.controller.renderYearAverages(this.dataYearAveragesCache.get(this.dataSelectedYear), low, high, COLOURSLIGHT)
        } catch (error) {
            console.error(error)
            return;
        }
    }

    activeChangeCallback(_active: string) {
        if(!this.dataSelectedYear) this.dataSelectedYear = 1943
        console.log(_active, this.dataSelectedYear)
    }
}



