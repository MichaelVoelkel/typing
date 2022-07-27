import { createEventBus, slot } from "ts-event-bus";
import { stringify } from "ts-jest";
import SessionStatistics from "../statistics/session_statistics";
import EventEmitter from "../typewriter/event_emitter";
import Line from "../typewriter/line";

const Events = {
    rightToken: slot<{token: string, timeInMs: number}>(),
    wrongToken: slot<{expected: string, actual: string, timeInMs: number}>(),
    rightWord: slot<{word: string, timeInMs: number}>(),
    wrongWord: slot<{word: string, timeInMs: number}>()
};

export class StatisticsCollector {
    private eventBus: typeof Events;

    constructor(private sessionStatistics: SessionStatistics) {
        this.eventBus = createEventBus({events: Events});
        this.handleRightToken();
        this.handleWrongToken();
        this.handleRightWord();
        this.handleWrongWord();
    }

    private handleRightToken(): void {
        this.eventBus.rightToken.on((obj: {token: string, timeInMs: number}) => {
            this.sessionStatistics.addRightKeyStroke(obj.token, obj.timeInMs);
        });
    }

    private handleWrongToken(): void {
        this.eventBus.wrongToken.on((obj: {expected: string, actual: string, timeInMs: number}) => {
            this.sessionStatistics.addWrongKeyStroke(obj.actual, obj.timeInMs);
        });
    }

    private handleRightWord(): void {
        this.eventBus.rightWord.on((obj: {word: string, timeInMs: number}) => {
            this.sessionStatistics.addRightWord(obj.word, obj.timeInMs);
        });
    }

    private handleWrongWord(): void {
        this.eventBus.wrongWord.on((obj: {word: string, timeInMs: number}) => {
            this.sessionStatistics.addWrongWord(obj.word, obj.timeInMs);
        });
    }

    getTypeWriterEventEmitter(line: Line): EventEmitter {
        return new TypeWriterEventEmitter(line, this.eventBus);
    }
}

class TypeWriterEventEmitter implements EventEmitter {
    constructor(private line: Line, private eventBus: typeof Events) {
    }

    wrongToken(expected: string, actual: string, timeInMs: number): void {
        this.eventBus.wrongToken({
            expected: expected,
            actual: actual,
            timeInMs: timeInMs
        });
    }

    rightToken(actual: string, timeInMs: number): void {
        this.eventBus.rightToken({
            token: actual,
            timeInMs: timeInMs
        });
    }

    rightWord(word: string, timeInMs: number): void {
        this.eventBus.rightWord({
            word: word,
            timeInMs: timeInMs
        });
    }
    wrongWord(word: string, timeInMs: number): void {
        this.eventBus.wrongWord({
            word: word,
            timeInMs: timeInMs
        });
    }
}