import { Controller } from './controller.js'
import { YEARRANGE, DataYearAverages, DataMaximumValues } from './api.js'
import { COLOURSLIGHT, ViewTypes } from './config.js';

export class Manager {
    controller: Controller;

    dataSelectedYear: number;
    dataMaximumValues: DataMaximumValues
    dataYearAveragesCache: Map<number, DataYearAverages>

    constructor(_controller: Controller) {
        this.controller = _controller;
        this.controller.managerChangeCallback = this.activeChangeCallback;
        this.dataYearAveragesCache = new Map();
    }

    getMaximumValues(): boolean {
        try {
            $.get('api/maxValues', (data) => {
                if(!data || Object.keys(data).length == 0) return false;
                // do a bit of parsing.
                this.dataMaximumValues = data;
            })

        } catch(error) {
            console.log(error);
            return false;
        }
    }

    getYearAverage(_year: number): DataYearAverages | null {
        try {
            $.get(`api/yearAverages/${_year}`, (data) => {
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

    handleYearSelection(_year: number) {
        try {
            if(this.dataSelectedYear == _year) return;
            for(let it = _year - 5; it < _year + 5; it++) {
                if(_year < YEARRANGE.low || _year > YEARRANGE.high || this.dataYearAveragesCache.has(_year)) continue;
                let data = this.getYearAverage(_year)
                this.dataYearAveragesCache.set(_year, data);
            }

            this.dataSelectedYear = _year;
            let low: number, high: number;
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

            this.controller.renderYearAverages(this.dataYearAveragesCache.get(this.dataSelectedYear), low, high, COLOURSLIGHT)
        } catch (error) {
            console.error(error)
            return;
        }
    }

    activeChangeCallback(_active: string) {
        console.log(_active)
    }
}



