import { Predictor } from './predictor';
import { Visibility } from './visibility';

(async () => {
    const visibilities: Visibility[] = [
        new Visibility(2, new Date(2018, 3 - 1, 31, 8)),
        new Visibility(4, new Date(2018, 4 - 1, 11, 8)),
        new Visibility(3, new Date(2018, 5 - 1, 5, 9)),
        new Visibility(4, new Date(2018, 5 - 1, 6, 9)),
        new Visibility(4, new Date(2018, 5 - 1, 10, 12)),
        new Visibility(4, new Date(2018, 5 - 1, 12, 12)),

        // OTHER:
        new Visibility(5, new Date(2018, 2 - 1, 22, 12)),
        new Visibility(4, new Date(2018, 3 - 1, 16, 8)),
    ];

    const predictor: Predictor = new Predictor(visibilities);

    await predictor.train();

    // const testTimestamp: Date = new Date(2018, 2 - 1, 9, 12);
})();
