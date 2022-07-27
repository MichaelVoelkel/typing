import DetailedSessionStatistics from "domain/session/detailed_session_statistics";

describe('Detailed session collect test', () => {
    test('Word precision tests', () => {
        const stats = new DetailedSessionStatistics();
        stats.addRightWord('easy', 100);
        stats.addRightWord('easy', 100);
        stats.addRightWord('easy', 100);

        stats.addRightWord('medium', 100);
        stats.addWrongWord('medium', 100);

        stats.addWrongWord('hard', 100);

        expect(stats.getWordTable()[0].word).toBe('hard');
        expect(stats.getWordTable()[0].precision).toBeCloseTo(0.);
        expect(stats.getWordTable()[0].rightStrokes).toBe(0);
        expect(stats.getWordTable()[0].wrongStrokes).toBe(1);

        expect(stats.getWordTable()[1].word).toBe('medium');
        expect(stats.getWordTable()[1].precision).toBeCloseTo(0.5);
        expect(stats.getWordTable()[1].rightStrokes).toBe(1);
        expect(stats.getWordTable()[1].wrongStrokes).toBe(1);

        expect(stats.getWordTable()[2].word).toBe('easy');
        expect(stats.getWordTable()[2].precision).toBeCloseTo(1.);
        expect(stats.getWordTable()[2].rightStrokes).toBe(3);
        expect(stats.getWordTable()[2].wrongStrokes).toBe(0);

        expect(stats.getTotalWordPrecision()).toBeCloseTo(4. / 6.);
    });

    test('Key stroke precision tests', () => {
        const stats = new DetailedSessionStatistics();
        stats.addRightKeyStroke('e', 100);
        stats.addRightKeyStroke('e', 100);
        stats.addRightKeyStroke('e', 100);

        stats.addRightKeyStroke('m', 100);
        stats.addWrongKeyStroke('m', 100);

        stats.addWrongKeyStroke('h', 100);

        expect(stats.getKeyStrokeTable()[0].character).toBe('h');
        expect(stats.getKeyStrokeTable()[0].precision).toBeCloseTo(0.);
        expect(stats.getKeyStrokeTable()[0].rightStrokes).toBe(0);
        expect(stats.getKeyStrokeTable()[0].wrongStrokes).toBe(1);

        expect(stats.getKeyStrokeTable()[1].character).toBe('m');
        expect(stats.getKeyStrokeTable()[1].precision).toBeCloseTo(0.5);
        expect(stats.getKeyStrokeTable()[1].rightStrokes).toBe(1);
        expect(stats.getKeyStrokeTable()[1].wrongStrokes).toBe(1);

        expect(stats.getKeyStrokeTable()[2].character).toBe('e');
        expect(stats.getKeyStrokeTable()[2].precision).toBeCloseTo(1.);
        expect(stats.getKeyStrokeTable()[2].rightStrokes).toBe(3);
        expect(stats.getKeyStrokeTable()[2].wrongStrokes).toBe(0);

        expect(stats.getTotalCharacterPrecision()).toBeCloseTo(4. / 6.);
    });

    test('Performance test', () => {
        const stats = new DetailedSessionStatistics();

        stats.addRightKeyStroke('s', 100);
        stats.addRightKeyStroke('o', 50);
        stats.addRightKeyStroke('m', 25);
        stats.addRightKeyStroke('e', 10);
        stats.addRightKeyStroke(' ', 3);

        const totalTimeInMs = 100 + 50 + 25 + 10 + 3;
        stats.addRightWord("some ", totalTimeInMs);

        const msPerMinute = 60 * 1000;
        expect(stats.getTotalWPM()).toBeCloseTo(1. / totalTimeInMs * msPerMinute);
        expect(stats.getTotalCPM()).toBeCloseTo(5. / totalTimeInMs * msPerMinute);
    });
});
