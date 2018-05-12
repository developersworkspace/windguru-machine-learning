import * as cheerio from 'cheerio';
import { Measurement } from './measurement';

export class MeasurementBuilder {

    constructor() {

    }

    public build(html: string): Measurement[] {
        let result: Measurement[] = [];

        const measurementAttributes: string[] = this.buildMeasurementAttributes(html);

        const timeOfDays: string[] = this.buildTimeOfDays(html);

        const cheerioInstance = cheerio.load(html);

        const rows: any[] = cheerioInstance('table.forecast.daily-archive tr');

        for (let rowIndex = 2; rowIndex < rows.length; rowIndex++) {
            const measurement: Measurement[] = this.rowToMeasurements(measurementAttributes, rows[rowIndex], timeOfDays);

            result = result.concat(measurement);
        }

        result.sort((a: Measurement, b: Measurement) => {
            return a.timestamp.getTime() - b.timestamp.getTime();
        });

        return result;
    }

    protected buildMeasurementAttributes(html: string): string[] {
        const cheerioInstance = cheerio.load(html);

        const rows: any[] = cheerioInstance('table.forecast.daily-archive tr');

        const measurementAttributes: string[] = [];

        const measurementAttributeColumns: any[] = cheerio(rows[0]).find('td');

        for (let index = 1; index < measurementAttributeColumns.length; index++) {
            const name: string = cheerio(measurementAttributeColumns[index]).html();

            measurementAttributes.push(name);
        }

        return measurementAttributes;
    }

    protected buildTimeOfDays(html: string): string[] {
        const cheerioInstance = cheerio.load(html);

        const rows: any[] = cheerioInstance('table.forecast.daily-archive tr');

        const timeOfDays: string[] = [];

        const timeOfDayColumns: any[] = cheerio(rows[1]).find('td');

        // tslint:disable-next-line:prefer-for-of
        for (let timeOfDayIndex = 0; timeOfDayIndex < timeOfDayColumns.length; timeOfDayIndex++) {
            const name: string = cheerio(timeOfDayColumns[timeOfDayIndex]).html();

            if (timeOfDays.indexOf(name) === -1) {
                timeOfDays.push(name);
            }
        }

        return timeOfDays;
    }

    protected rowToMeasurements(measurementAttributes: string[], row: any, timeOfDays: string[]): Measurement[] {
        const result: Measurement[] = [];

        const columns: any[] = cheerio(row).find('td');

        const timestamp: string = cheerio(columns[0]).find('b').html();

        for (let timeOfDayIndex = 0; timeOfDayIndex < timeOfDays.length; timeOfDayIndex++) {
            const measurement: Measurement = new Measurement(
                // null,
                // null,
                null,
                new Date(
                    parseInt(timestamp.substring(6, 10), undefined),
                    parseInt(timestamp.substring(3, 5), undefined) - 1,
                    parseInt(timestamp.substring(0, 2), undefined),
                    parseInt(timeOfDays[timeOfDayIndex].substring(0, timeOfDays[timeOfDayIndex].length - 1), undefined),
                ),
                null,
                null,
                null,
                null,
                null,
            );

            for (let measurementAttributeIndex = 0; measurementAttributeIndex < measurementAttributes.length; measurementAttributeIndex++) {
                const index: number = (measurementAttributeIndex * timeOfDays.length) + timeOfDayIndex + 1;

                if (measurementAttributes[measurementAttributeIndex] === 'Wind speed (knots)') {
                    let rawValue: string = cheerio(columns[index]).html();

                    if (rawValue === ' - ') {
                        continue;
                    }

                    if (new RegExp(/<b>.*<\/b>/).test(rawValue)) {
                        rawValue = cheerio(columns[index]).find('b').html();
                    }

                    const value: number = parseInt(rawValue, undefined);

                    if (isNaN(value)) {
                        console.log(`Could not parse 'windSpeedInKnots' [${rawValue}]`);
                    }

                    measurement.windSpeedInKnots = value;
                }

                if (measurementAttributes[measurementAttributeIndex] === 'Wind direction') {
                    const rawValue: string = cheerio(columns[index]).html();

                    const matches: RegExpExecArray = new RegExp(/rotate\(([\d]+),50,50\)/).exec(rawValue);

                    if (matches) {
                        const value: number = parseInt(matches[1], undefined);

                        if (isNaN(value)) {
                            console.log(`Could not parse 'windDirectionInDegrees' [${rawValue}]`);
                        }

                        measurement.windDirectionInDegrees = value;
                    }
                }

                if (measurementAttributes[measurementAttributeIndex] === 'Wave (m)') {
                    let rawValue: string = cheerio(columns[index]).html();

                    if (rawValue === ' - ') {
                        continue;
                    }

                    if (new RegExp(/<b>.*<\/b>/).test(rawValue)) {
                        rawValue = cheerio(columns[index]).find('b').html();
                    }

                    const value: number = parseInt(rawValue, undefined);

                    if (isNaN(value)) {
                        console.log(`Could not parse 'waveHeightInMeters' [${rawValue}]`);
                    }

                    measurement.waveHeightInMeters = value;
                }

                if (measurementAttributes[measurementAttributeIndex] === 'Wave direction') {
                    const rawValue: string = cheerio(columns[index]).html();

                    const matches: RegExpExecArray = new RegExp(/rotate\(([\d]+),50,50\)/).exec(rawValue);

                    if (matches) {
                        const value: number = parseInt(matches[1], undefined);

                        if (isNaN(value)) {
                            console.log(`Could not parse 'waveDirectionInDegrees' [${rawValue}]`);
                        }

                        measurement.waveDirectionInDegrees = value;
                    }
                }

                if (measurementAttributes[measurementAttributeIndex] === 'Wave period (s)') {
                    const rawValue: string = cheerio(columns[index]).find('b').html();

                    if (!rawValue) {
                        continue;
                    }

                    const value: number = parseInt(rawValue, undefined);

                    if (isNaN(value)) {
                        console.log(`Could not parse 'wavePeriodInSeconds' [${rawValue}]`);
                    }

                    measurement.wavePeriodInSeconds = value;
                }

                if (measurementAttributes[measurementAttributeIndex] === 'Temperature (&#xB0;C)') {
                    const rawValue: string = cheerio(columns[index]).html();

                    if (rawValue === ' - ') {
                        continue;
                    }

                    const value: number = parseInt(rawValue, undefined);

                    if (isNaN(value)) {
                        console.log(`Could not parse 'temperatureInCelsius' [${rawValue}]`);
                    }

                    measurement.temperatureInCelsius = value;
                }
            }

            if (measurement.valid()) {
                result.push(measurement);
            }
        }

        return result;
    }

}
