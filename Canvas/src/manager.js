var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.controller.manager = this;
        // Initialize Cache map.
        this.dataYearAveragesCache = new Map();
        this.dataSelectedYear = 1943;
    }
    parseMaximumValues(_data) {
        let min_rainfall = Number.MAX_VALUE;
        let max_rainfall = 0;
        let min_sunshine = Number.MAX_VALUE;
        let max_sunshine = 0;
        let min_lowTemp = Number.MAX_VALUE;
        let max_lowTemp = 0;
        let min_highTemp = Number.MAX_VALUE;
        let max_highTemp = 0;
        for (let entry in Object.entries(_data)) {
            let entryObj = Object.entries(_data)[entry][1];
            if (entryObj.min_rainfall < min_rainfall)
                min_rainfall = entryObj.min_rainfall;
            if (entryObj.max_rainfall > max_rainfall)
                max_rainfall = entryObj.max_rainfall;
            if (entryObj.min_sunshine < min_sunshine)
                min_sunshine = entryObj.min_sunshine;
            if (entryObj.max_sunshine > max_sunshine)
                max_sunshine = entryObj.max_sunshine;
            if (entryObj.min_lowTemp < min_lowTemp)
                min_lowTemp = entryObj.min_lowTemp;
            if (entryObj.max_lowTemp > max_lowTemp)
                max_lowTemp = entryObj.max_lowTemp;
            if (entryObj.min_highTemp < min_highTemp)
                min_highTemp = entryObj.min_highTemp;
            if (entryObj.max_highTemp > max_highTemp)
                max_highTemp = entryObj.max_highTemp;
        }
        return {
            min_rainfall: min_rainfall,
            max_rainfall: max_rainfall,
            min_sunshine: min_sunshine,
            max_sunshine: max_sunshine,
            min_lowTemp: min_lowTemp,
            max_lowTemp: max_lowTemp,
            min_highTemp: min_highTemp,
            max_highTemp: max_highTemp
        };
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
                this.dataMaximumValues = this.parseMaximumValues(data);
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Make AJAX Request to yearAverages route, passing in the year as a parameter.
                return yield $.get(`https://harrysmith.dev/api/data_year_averages?year=${_year}`, (data) => {
                    // Data validation to check success of request.
                    if (!data || Object.keys(data).length == 0)
                        return false;
                    // do a bit of parsing.
                    this.dataYearAveragesCache.set(_year, data);
                    return data;
                });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                _year = Number(_year);
                let promises = [];
                // Account for data 5 years either side of the selected year.
                for (let it = (_year - 5); it < (_year + 5); it++) {
                    // If Year is out of bounds for the dataset, skip.
                    // If data for the Year has already been requested, skip.
                    if (it < YEARRANGE.low || it > YEARRANGE.high || this.dataYearAveragesCache.has(it))
                        continue;
                    // API Request function.
                    promises.push(yield this.getYearAverage(it));
                    // Add Data to Storage.
                }
                Promise.all(promises).then(() => {
                    let dataset = {
                        en: [],
                        ni: [],
                        wa: [],
                        sc: []
                    };
                    for (let it = (_year - 5); it < (_year + 5); it++) {
                        let dataInstance = this.dataYearAveragesCache.get(it);
                        if (!dataInstance)
                            continue;
                        // console.log(dataInstance.en)
                        dataset.en.push([dataInstance.en.rainfall, dataInstance.en.sunshine, dataInstance.en.lowTemp, dataInstance.en.highTemp, it]);
                        dataset.ni.push([dataInstance.ni.rainfall, dataInstance.ni.sunshine, dataInstance.ni.lowTemp, dataInstance.ni.highTemp, it]);
                        dataset.sc.push([dataInstance.wa.rainfall, dataInstance.wa.sunshine, dataInstance.wa.lowTemp, dataInstance.wa.highTemp, it]);
                        dataset.wa.push([dataInstance.sc.rainfall, dataInstance.sc.sunshine, dataInstance.sc.lowTemp, dataInstance.sc.highTemp, it]);
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
                });
            }
            catch (error) {
                console.error(error);
                return;
            }
        });
    }
    activeChangeCallback(_active) {
        // Javascript moment not allowing me to access a variable I very much assigned.
        // if(!this.dataSelectedYear) this.dataSelectedYear = 1943
        // console.log(_active, this.dataSelectedYear)
        console.log(document.getElementById("yearslider").value, _active);
    }
}
//# sourceMappingURL=manager.js.map