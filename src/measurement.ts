export class Measurement {

    constructor(
        // public cloudCoverInPercentage: number,
        // public rainInMillimeterPer3Hours: number,
        public temperatureInCelsius: number,
        public timestamp: Date,
        public waveDirectionInDegrees: number,
        public waveHeightInMeters: number,
        public wavePeriodInSeconds: number,
        public windDirectionInDegrees: number,
        public windSpeedInKnots: number,
    ) {

    }

    public valid(): boolean {
        if (
            !this.temperatureInCelsius ||
            !this.timestamp ||
            !this.waveDirectionInDegrees ||
            !this.waveHeightInMeters ||
            !this.wavePeriodInSeconds ||
            !this.windDirectionInDegrees ||
            !this.windSpeedInKnots) {
            return false;
        }

        return true;
    }

}
