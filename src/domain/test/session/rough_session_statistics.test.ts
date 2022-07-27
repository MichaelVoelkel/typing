import DetailedSessionStatistics from "domain/session/detailed_session_statistics";
import RoughSessionStatistics from "domain/session/rough_session_statistics";

describe('Rough session statistics test', () => {
    test('Word statistics generated from detailed statistics right', () => {
        const detailStatistics = new DetailedSessionStatistics();

        detailStatistics.addRightWord("easy", 100);
        detailStatistics.addRightWord("easy", 50);
        detailStatistics.addRightWord("easy", 25);

        detailStatistics.addRightWord("medium", 1000);
        detailStatistics.addWrongWord("medium", 500);

        detailStatistics.addWrongWord("hard", 10000);

        const totalTime = 100 + 50 + 25 + 1000 + 500 + 10000;

        const roughStatistics = RoughSessionStatistics.createFromDetailedSessionStatistics(detailStatistics);

        expect(roughStatistics.getTotalTypedWords()).toBe(6);
        expect(roughStatistics.getWordPrecision()).toBeCloseTo(4. / 6.);

        const msPerMinute = 60 * 1000;

        expect(roughStatistics.getTotalWPM()).toBeCloseTo(6. / totalTime * msPerMinute);
    });

    test('Character statistics generated from detailed statistics right', () => {
        const detailStatistics = new DetailedSessionStatistics();

        detailStatistics.addRightKeyStroke("e", 100);
        detailStatistics.addRightKeyStroke("e", 50);
        detailStatistics.addRightKeyStroke("e", 25);

        detailStatistics.addRightKeyStroke("m", 1000);
        detailStatistics.addWrongKeyStroke("m", 500);

        detailStatistics.addWrongKeyStroke("h", 10000);

        const totalTime = 100 + 50 + 25 + 1000 + 500 + 10000;

        const roughStatistics = RoughSessionStatistics.createFromDetailedSessionStatistics(detailStatistics);

        expect(roughStatistics.getTotalTypedCharacters()).toBe(6);
        expect(roughStatistics.getCharacterPrecision()).toBeCloseTo(4. / 6.);

        const msPerMinute = 60 * 1000;

        expect(roughStatistics.getTotalCPM()).toBeCloseTo(6. / totalTime * msPerMinute);
    });
});