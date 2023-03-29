import { YEARRANGE } from './api.js';
import { COLOURSLIGHT, ViewTypes } from './config.js';
export class Manager {
    constructor(_controller) {
        this.controller = _controller;
        this.controller.managerChangeCallback = this.activeChangeCallback;
        this.dataYearAveragesCache = new Map();
    }
    getMaximumValues() {
        try {
            $.get('api/maxValues', (data) => {
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
    getYearAverage(_year) {
        try {
            $.get(`api/yearAverages/${_year}`, (data) => {
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
    handleYearSelection(_year) {
        try {
            if (this.dataSelectedYear == _year)
                return;
            for (let it = _year - 5; it < _year + 5; it++) {
                if (_year < YEARRANGE.low || _year > YEARRANGE.high || this.dataYearAveragesCache.has(_year))
                    continue;
                let data = this.getYearAverage(_year);
                this.dataYearAveragesCache.set(_year, data);
            }
            this.dataSelectedYear = _year;
            let low, high;
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