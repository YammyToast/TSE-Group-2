import { YEARRANGE } from './api.js';
import { COLOURSLIGHT, ViewTypes } from './config.js';
import { maximumValues, yearAverages1910 } from './tempData.js';
/**
 * Data Abstraction layer for the canvas.
 * Maintains records of data requests made to the server.
 * Includes making AJAX requests as well as caching made requests.
 * Handles a single Canvas instance through a provided controller.
 */
export class Manager {
    /**
     * Constructor for a Manager. Requires dependency injection of a Pre-loaded Controller / Canvas.
     * @param _controller Pre-initalized Controller instance.
     */
    constructor(_controller) {
        this.controller = _controller;
        // Bind callback function for controller instance to a method of this class.
        this.controller.managerChangeCallback = this.activeChangeCallback;
        // Initialize Cache map.
        this.dataYearAveragesCache = new Map();
        this.dataSelectedYear = 1943;
        this.dataMaximumValues = maximumValues;
        this.dataYearAveragesCache.set(1910, yearAverages1910);
        this.dataYearAveragesCache.set(1911, yearAverages1910);
        this.dataYearAveragesCache.set(1912, yearAverages1910);
        this.dataYearAveragesCache.set(1913, yearAverages1910);
        this.dataYearAveragesCache.set(1914, yearAverages1910);
        this.dataYearAveragesCache.set(1915, yearAverages1910);
        this.dataYearAveragesCache.set(1916, yearAverages1910);
        this.dataYearAveragesCache.set(1917, yearAverages1910);
        this.dataYearAveragesCache.set(1918, yearAverages1910);
        this.dataYearAveragesCache.set(1919, yearAverages1910);
        this.dataYearAveragesCache.set(1920, yearAverages1910);
    }
    /**
     * Makes a request for the maximum data values of the dataset.
     * Used to test connectivity to the server during canvas intializiation.
    */
    getMaximumValues() {
        try {
            // Make AJAX Request to maxValues route.
            $.get('https://harrysmith.dev/api/data_max_values', (data) => {
                // Data validation to check success of request.
                if (!data || Object.keys(data).length == 0)
                    return false;
                // do a bit of parsing.
                this.dataMaximumValues = data;
            });
        }
        catch (error) {
            console.log(error);
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
    getYearAverage(_year) {
        try {
            // Make AJAX Request to yearAverages route, passing in the year as a parameter.
            $.get(`https://harrysmith.dev/api/data_year_averages?year=${_year}`, (data) => {
                // Data validation to check success of request.
                if (!data || Object.keys(data).length == 0)
                    return false;
                // do a bit of parsing.
                return {};
            });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    /**
     * Requests all the averages, of all the datatypes,
     * for a single year.
     * @param _year Year of the data to request.
     * @returns yearAverageInstance, containing parsed data for the year,
     * or null if the request failed.
     */
    getFullYearValues(_year, _country) {
        try {
            // Make AJAX Request to yearAverages route, passing in the year as a parameter.
            $.get(`https://harrysmith.dev/api/data_full_year_values?year=${_year}&country=${_country}`, (data) => {
                // Data validation to check success of request.
                if (!data || Object.keys(data).length == 0)
                    return false;
                // do a bit of parsing.
                return {};
            });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    /**
     * Handles event of the selected year being changed by the user.
     * Makes an API request then calls for render of the currently selected view.
     * @param _year Year selected by the user.
     * @returns Void.
     */
    handleYearSelection(_year) {
        try {
            // If the selected year is the same as previously, do nothing.
            let dataset = [];
            if (this.dataSelectedYear == _year)
                return;
            // Account for data 5 years either side of the selected year.
            for (let it = _year - 5; it < _year + 5; it++) {
                // If Year is out of bounds for the dataset, skip.
                // If data for the Year has already been requested, skip.
                if (_year < YEARRANGE.low || _year > YEARRANGE.high || this.dataYearAveragesCache.has(_year))
                    continue;
                // API Request function.
                // let data = this.getYearAverage(_year)
                let data = yearAverages1910;
                // Add Data to Storage.
                this.dataYearAveragesCache.set(_year, data);
            }
            for (let it = _year - 5; it < _year + 5; it++) {
                let dataInstance = this.dataYearAveragesCache.get(it);
                console.log(this.dataYearAveragesCache);
                dataset.push([dataInstance.en.rainfall, dataInstance.en.sunshine, dataInstance.en.lowTemp, dataInstance.en.highTemp]);
                dataset.push([dataInstance.ni.rainfall, dataInstance.ni.sunshine, dataInstance.ni.lowTemp, dataInstance.ni.highTemp]);
                dataset.push([dataInstance.wa.rainfall, dataInstance.wa.sunshine, dataInstance.wa.lowTemp, dataInstance.wa.highTemp]);
                dataset.push([dataInstance.sc.rainfall, dataInstance.sc.sunshine, dataInstance.sc.lowTemp, dataInstance.sc.highTemp]);
            }
            // Set selected year value for previous check.
            this.dataSelectedYear = _year;
            let low, high;
            // Set basis for data intensity of selected year based on view.
            // Intensity is where the data sits between the maximum and minimum values.
            switch (this.controller.viewActive) {
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
            this.controller.renderYearAverages(this.dataYearAveragesCache.get(this.dataSelectedYear), low, high, COLOURSLIGHT);
            let graphYear = this.dataSelectedYear;
            if (graphYear - 1910 < 5)
                graphYear = 1915;
            if (2022 - graphYear < 5)
                graphYear = 2015;
            this.controller.setGraphYearAverages(dataset);
            // console.log("Swag", graphYear)
        }
        catch (error) {
            console.error(error);
            return;
        }
    }
    activeChangeCallback(_active) {
        // Javascript moment not allowing me to access a variable I very much assigned.
        // if(!this.dataSelectedYear) this.dataSelectedYear = 1943
        console.log(_active, this.dataSelectedYear);
    }
}
//# sourceMappingURL=manager.js.map