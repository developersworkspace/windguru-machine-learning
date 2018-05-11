export class StatisticsHelper {

    public static euclideanDistance(a: number[], b: number[]): number {
        let value: number = 0;

        for (let index = 0; index < a.length; index++) {
            value += Math.pow(a[index] - b[index], 2);
        }

        return Math.sqrt(value);
    }

}
