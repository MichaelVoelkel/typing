import Config from "domain/config/config";
import { StatisticsCollector } from "domain/interactions/statistics_collector";
import DetailedSessionStatistics from "domain/session/detailed_session_statistics";
import Line from "domain/typewriter/line";
import Word from "domain/typewriter/word";

const strokeTime = 100;

describe('check basic counts', () => {
    function init(): [DetailedSessionStatistics, StatisticsCollector, Line] {
        const stats = new DetailedSessionStatistics();
        const line = new Line(new Config, [new Word("abc")], 0, 0);
        const collector = new StatisticsCollector(stats);
        
        line.setEventEmitter(collector.getTypeWriterEventEmitter(line));
        
        return [stats, collector, line];
    }

    test('Right inputs', () => {
        const [stats, _collector, line] = init();        

        line.handleKeyStroke("a", strokeTime);
        line.handleKeyStroke("b", strokeTime);
        line.handleKeyStroke("c", strokeTime);

        expect(stats.getRightKeyStrokes()).toBe(3);
        expect(stats.getWrongKeyStrokes()).toBe(0);
    });

    test('Some right/wrong inputs', () => {
        const [stats, _collector, line] = init();        

        line.handleKeyStroke("a", strokeTime);
        line.handleKeyStroke("b", strokeTime);
        line.handleKeyStroke("Z", strokeTime);
        line.handleKeyStroke("c", strokeTime);

        expect(stats.getRightKeyStrokes()).toBe(3);
        expect(stats.getWrongKeyStrokes()).toBe(1);
    });

    test('Complete word', () => {
        const [stats, _collector, line] = init();        

        line.handleKeyStroke("a", strokeTime);
        line.handleKeyStroke("b", strokeTime);
        line.handleKeyStroke("c", strokeTime);
        line.handleKeyStroke(" ", strokeTime);

        expect(stats.getWordTable().length).toBe(1);
        expect(stats.getWordTable()[0].word).toBe("abc");
        expect(stats.getWordTable()[0].precision).toBeCloseTo(1.);
    });

    test('Complete word with errors', () => {
        const [stats, _collector, line] = init();        

        line.handleKeyStroke("a", strokeTime);
        line.handleKeyStroke("b", strokeTime);
        line.handleKeyStroke("Z", strokeTime);
        line.handleKeyStroke("c", strokeTime);
        line.handleKeyStroke(" ", strokeTime);

        expect(stats.getWordTable().length).toBe(1);
        expect(stats.getWordTable()[0].word).toBe("abc");
        expect(stats.getWordTable()[0].precision).toBeCloseTo(0.);
    });
});