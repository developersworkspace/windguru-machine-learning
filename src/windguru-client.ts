import axios from 'axios';
import * as moment from 'moment';
import { Measurement } from './measurement';
import { MeasurementBuilder } from './measurement-builder';

export class WindguruClient {

    constructor() {

    }

    public async getMeasurement(spot: number, timestamp: Date): Promise<Measurement> {
        const measurements: Measurement[] = await this.getMeasurements(timestamp, spot, timestamp);

        const filteredMeasurements: Measurement[] = measurements.filter((x: Measurement) => x.timestamp <= timestamp);

        if (filteredMeasurements.length === 0) {
            return null;
        }

        const measurement: Measurement = filteredMeasurements[filteredMeasurements.length - 1];

        return measurement;
    }

    public async getMeasurements(from: Date, spot: number, to: Date): Promise<Measurement[]> {
        const html: string = await this.loadHTML(from, spot, to);

        const measurementBuilder: MeasurementBuilder = new MeasurementBuilder();

        const measurements: Measurement[] = measurementBuilder.build(html);

        return measurements;
    }

    protected async loadHTML(from: Date, spot: number, to: Date): Promise<string> {
        const parameters: any = {
            date_from: moment(from).format('YYYY-MM-DD'),
            date_to: moment(to).format('YYYY-MM-DD'),
            step: 3,
            pwindspd: 1,
            psmer: 1,
            phtsgw: 1,
            pwavesmer: 1,
            pperpw: 1,
            ptmp: 1,
            papcp: 1,
            ptcdc: 1,
            id_spot: spot,
            id_model: 3,
        };

        const response: any = await axios({
            data: Object.keys(parameters).map((key: string) => `${key}=${parameters[key]}`).join('&'),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            responseType: 'text',
            url: `https://www.windguru.cz/ajax/ajax_archive.php`,
        });

        console.log(response.status);

        return `${response.data}</td></tr></table>`;
    }

}
