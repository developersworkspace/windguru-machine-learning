import { Measurement } from './measurement';
import { StatisticsHelper } from './statistics-helper';
import { Visibility } from './visibility';
import { WindguruClient } from './windguru-client';

export class Predictor {

    protected averageDistance: number = null;

    constructor(protected visibilities: Visibility[]) {

    }

    public async predict(timestamp: Date): Promise<number> {
        const predictMeasurement: Measurement = await new WindguruClient().getMeasurement(91, timestamp);

        let nearestDistance: number = null;

        let nearestVisibility: Visibility = null;

        for (const visibility of this.visibilities) {
            const measurement: Measurement = await new WindguruClient().getMeasurement(91, visibility.timestamp);

            if (!measurement) {
                continue;
            }

            const distance: number = StatisticsHelper.euclideanDistance([
                measurement.temperatureInCelsius,
                measurement.waveDirectionInDegrees,
                measurement.waveHeightInMeters,
                measurement.wavePeriodInSeconds,
                measurement.windDirectionInDegrees,
                measurement.windSpeedInKnots,
            ], [
                    predictMeasurement.temperatureInCelsius,
                    predictMeasurement.waveDirectionInDegrees,
                    predictMeasurement.waveHeightInMeters,
                    predictMeasurement.wavePeriodInSeconds,
                    predictMeasurement.windDirectionInDegrees,
                    predictMeasurement.windSpeedInKnots,
                ]);

            if (!nearestDistance || distance < nearestDistance) {
                nearestDistance = distance;
                nearestVisibility = visibility;
            }
        }

        const rating: number = (this.averageDistance - nearestDistance) / this.averageDistance * nearestVisibility.rating;

        return rating;
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
