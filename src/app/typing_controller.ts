import { StatisticsCollector } from "domain/interactions/statistics_collector";
import DetailedSessionStatistics, { KeyStrokeTable, WordTable } from "domain/session/detailed_session_statistics";
import Line from "domain/typewriter/line";
import { Signal } from "typed-signals";

import Config from "domain/config/config";
import { allDictionaries } from "domain/dictionary/dictionaries";
import Dictionary from "domain/dictionary/dictionary";
import SessionResult from "domain/session/session_result";
import RoughSessionStatistics from "domain/session/rough_session_statistics";

function currentTimeInMs(): number {
    return Date.now();
}

export default class TypingController {
    private line: Line;
    private statisticsCollector: StatisticsCollector;
    private sessionStatistics: DetailedSessionStatistics;
    private lastKeyStrokeTimeInMs: number;

    constructor(private dictID: string) {
        const selectedDict = allDictionaries.find((dict: Dictionary) => dict.getID() == dictID);

        this.line = new Line(new Config(), selectedDict!.getWords(), 0, 0);
        this.sessionStatistics = new DetailedSessionStatistics();
        this.statisticsCollector = new StatisticsCollector(this.sessionStatistics);
        this.line.setEventEmitter(this.statisticsCollector.getTypeWriterEventEmitter(this.line));

        this.lastKeyStrokeTimeInMs = currentTimeInMs();
    }

    handleType(keyStroke: string): void {
        const nextTimeInMs = currentTimeInMs();
        const strokeTime = nextTimeInMs - this.lastKeyStrokeTimeInMs;

        this.line.handleKeyStroke(keyStroke, strokeTime);

        this.lastKeyStrokeTimeInMs = nextTimeInMs;

        this.lineChanged.emit();
    }

    finishSession(): void {
        this.sessionFinished.emit(new SessionResult(
            this.dictID,
            new Date(),
            RoughSessionStatistics.createFromDetailedSessionStatistics(this.sessionStatistics)
        ));
    }

    getLineStringAndPosition(): [string, number] {
        const [lineString, position] = this.line.getLineStringAndCursorPosition();
        return [lineString, position];
    }

    getRightWrongStatistics(): [number, number] {
        return [
            this.sessionStatistics.getRightKeyStrokes(),
            this.sessionStatistics.getWrongKeyStrokes()
        ];
    }

    getCharacterStatistics() : KeyStrokeTable {
        return this.sessionStatistics.getKeyStrokeTable();
    }

    getWordStatistics() : WordTable {
        return this.sessionStatistics.getWordTable();
    }

    getTotalCPM(): number {
        return this.sessionStatistics.getTotalCPM();
    }

    getTotalWPM(): number {
        return this.sessionStatistics.getTotalWPM();
    }

    lineChanged = new Signal<() => void>();
    sessionFinished = new Signal<(sessionResult: SessionResult) => void>();
}