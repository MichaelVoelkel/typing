import { StatisticsCollector } from "domain/interactions/statistics_collector";
import SessionStatistics from "domain/statistics/session_statistics";
import Line from "domain/typewriter/line";
import Word from "domain/typewriter/word";
import { Signal } from "typed-signals";

import * as wordlist from '../data/english-words-10.json';

function currentTimeInMs(): number {
    return Date.now();
}

export default class TypingController {
    private line: Line;
    private statisticsCollector: StatisticsCollector;
    private sessionStatistics: SessionStatistics;
    private lastKeyStrokeTimeInMs: number;

    constructor() {
        let commonEnglishWords = Object.values(wordlist);

        let words: Word[] = [];
        commonEnglishWords.forEach((word: string) => words.push(new Word(word)));

        this.line = new Line(words, 0, 0);
        this.sessionStatistics = new SessionStatistics();
        this.statisticsCollector = new StatisticsCollector(this.sessionStatistics);
        this.line.setEventEmitter(this.statisticsCollector.getTypeWriterEventEmitter(this.line));

        this.lastKeyStrokeTimeInMs = currentTimeInMs();
    }

    handleType(keyStroke: string): void {
        const nextTimeInMs = currentTimeInMs();
        const strokeTime = nextTimeInMs - this.lastKeyStrokeTimeInMs;

        this.line.handleKeyStroke(keyStroke, strokeTime);

        console.log(strokeTime);

        this.lastKeyStrokeTimeInMs = nextTimeInMs;

        this.lineChanged.emit();
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

    lineChanged = new Signal<() => void>();
}