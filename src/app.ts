import { Measurement } from './measurement';
import { StatisticsHelper } from './statistics-helper';
import { Visibility } from './visibility';
import { WindguruClient } from './windguru-client';

(async () => {
    const visibilities: Visibility[] = [
        new Visibility(2, new Date(2018, 3 - 1, 31, 8)),
        new Visibility(4, new Date(2018, 4 - 1, 11, 8)),
        new Visibility(3, new Date(2018, 5 - 1, 5, 9)),
        new Visibility(4, new Date(2018, 5 - 1, 6, 9)),
        new Visibility(4, new Date(2018, 5 - 1, 10, 12)),
    ];

    const testTimestamp: Date = new Date(2018, 4 - 1, 13, 12);

    const testMeasurement: Measurement = await new WindguruClient().getMeasurement(91, testTimestamp);

    if (!testMeasurement) {
        console.log('ERROR');
        return;
    }

    const distances: any = {};

    const measurements: Measurement[] = [];

    for (const visibility of visibilities) {
        const measurement: Measurement = await new WindguruClient().getMeasurement(91, visibility.timestamp);

        if (!measurement) {
            continue;
        }

        measurements.push(measurement);
    }

    for (const measurement of measurements) {
        distances[measurement.timestamp.toString()] = StatisticsHelper.euclideanDistance([
            measurement.temperatureInCelsius,
            measurement.waveDirectionInDegrees,
            measurement.waveHeightInMeters,
            measurement.wavePeriodInSeconds,
            measurement.windDirectionInDegrees,
            measurement.windSpeedInKnots,
        ], [
            testMeasurement.temperatureInCelsius,
            testMeasurement.waveDirectionInDegrees,
            testMeasurement.waveHeightInMeters,
            testMeasurement.wavePeriodInSeconds,
            testMeasurement.windDirectionInDegrees,
            testMeasurement.windSpeedInKnots,
        ]);
    }

    console.log(distances);
})();
