import { Measurement } from './measurement';
import { StatisticsHelper } from './statistics-helper';
import { Visibility } from './visibility';
import { WindguruClient } from './windguru-client';

export class Predictor {

    protected averageDistance: number = null;

    constructor(protected visibilities: Visibility[]) {

    }

    public async train(): Promise<void> {
        let count: number = 0;
        let totalDistance: number = 0;

        const measurements: Measurement[] = await this.getMeasurementsFromVisibilities(this.visibilities);

        for (const measurement1 of measurements) {
            for (const measurement2 of measurements) {
                if (measurement1 === measurement2) {
                    continue;
                }

                count++;

                totalDistance += StatisticsHelper.euclideanDistance([
                    measurement1.temperatureInCelsius,
                    measurement1.waveDirectionInDegrees,
                    measurement1.waveHeightInMeters,
                    measurement1.wavePeriodInSeconds,
                    measurement1.windDirectionInDegrees,
                    measurement1.windSpeedInKnots,
                ], [
                        measurement2.temperatureInCelsius,
                        measurement2.waveDirectionInDegrees,
                        measurement2.waveHeightInMeters,
                        measurement2.wavePeriodInSeconds,
                        measurement2.windDirectionInDegrees,
                        measurement2.windSpeedInKnots,
                    ]);
            }
        }

        this.averageDistance = totalDistance / count;
    }

    protected async getMeasurementsFromVisibilities(visibilities: Visibility[]): Promise<Measurement[]> {
        const measurements: Measurement[] = [];

        for (const visibility of visibilities) {
            const measurement: Measurement = await new WindguruClient().getMeasurement(91, visibility.timestamp);

            if (!measurement) {
                continue;
            }

            measurements.push(measurement);
        }

        return measurements;
    }

}
