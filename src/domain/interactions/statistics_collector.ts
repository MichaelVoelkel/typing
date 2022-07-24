import { createEventBus, slot } from "ts-event-bus";
import { stringify } from "ts-jest";
import SessionStatistics from "../statistics/session_statistics";
import EventEmitter from "../typewriter/event_emitter";
import Line from "../typewriter/line";

const Events = {
    rightToken: slot<{token: string, timeInUs: number}>(),
    wrongToken: slot<{expected: string, actual: string, timeInUs: number}>()
};

export class StatisticsCollector {
    private eventBus: typeof Events;

    constructor(private sessionStatistics: SessionStatistics) {
        this.eventBus = createEventBus({events: Events});
        this.handleRightToken();
        this.handleWrongToken();
    }

    private handleRightToken(): void {
        this.eventBus.rightToken.on(() => {
            this.sessionStatistics.addRightKeyStroke();
        });
    }

    private handleWrongToken(): void {
        this.eventBus.wrongToken.on(() => {
            this.sessionStatistics.addWrongKeyStroke();
        });
    }

    getTypeWriterEventEmitter(line: Line): EventEmitter {
        return new TypeWriterEventEmitter(line, this.eventBus);
    }
}

class TypeWriterEventEmitter implements EventEmitter {
    constructor(private line: Line, private eventBus: typeof Events) {
    }

    wrongToken(expected: string, actual: string, timeInUs: number): void {
        this.eventBus.wrongToken({
            expected: expected,
            actual: actual,
            timeInUs: timeInUs
        });
    }

    rightToken(actual: string, timeInUs: number): void {
        this.eventBus.rightToken({
            token: actual,
            timeInUs: timeInUs
        });
    }
}