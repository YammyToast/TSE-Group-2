import { YEARRANGE } from './api.js';
import { COLOURSLIGHT, ViewTypes } from './config.js';
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
            $.get(`api/yearAverages/${_year}`, (data) => {
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
            if (this.dataSelectedYear == _year)
                return;
            // Account for data 5 years either side of the selected year.
            for (let it = _year - 5; it < _year + 5; it++) {
                // If Year is out of bounds for the dataset, skip.
                // If data for the Year has already been requested, skip.
                if (_year < YEARRANGE.low || _year > YEARRANGE.high || this.dataYearAveragesCache.has(_year))
                    continue;
                // API Request function.
                let data = this.getYearAverage(_year);
                // Add Data to Storage.
                this.dataYearAveragesCache.set(_year, data);
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
        }
        catch (error) {
            console.error(error);
            return;
        }
    }
    activeChangeCallback(_active) {
        console.log(_active);
    }
}
//# sourceMappingURL=manager.js.map