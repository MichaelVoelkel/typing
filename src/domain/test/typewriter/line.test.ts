import EventEmitter from "domain/typewriter/event_emitter"
import Line from "domain/typewriter/line";
import Word from "domain/typewriter/word";

const strokeTime = 100;

function init(): [EventEmitterMock, Line] {
    const eventEmitter = new EventEmitterMock();
    const line = new Line([new Word("abc")], 0, 0);
    line.setEventEmitter(eventEmitter);

    return [eventEmitter, line];
}

class EventEmitterMock implements EventEmitter {
    public wrongTokenCalls: number = 0;
    public rightTokenCalls: number = 0;

    wrongToken(_expected: string, _actual: string): void {
        ++this.wrongTokenCalls;
    }

    rightToken(_actual: string): void {
        ++this.rightTokenCalls;
    }
}

describe('Test one character line input', () => {
    test('Right input', () => {
        const [eventEmitter, line] = init();

        line.handleKeyStroke("a", strokeTime);

        expect(eventEmitter.rightTokenCalls).toBe(1);
        expect(eventEmitter.wrongTokenCalls).toBe(0);
    });

    test('Wrong input', () => {
        const [eventEmitter, line] = init();

        line.handleKeyStroke("b", strokeTime);

        expect(eventEmitter.rightTokenCalls).toBe(0);
        expect(eventEmitter.wrongTokenCalls).toBe(1);      
    });
});

describe('Test cursor movement', () => {
    test('Right input moves cursor', () => {
        const [eventEmitter, line] = init();

        line.handleKeyStroke("a", strokeTime);
        line.handleKeyStroke("b", strokeTime);
        line.handleKeyStroke("c", strokeTime);

        expect(eventEmitter.rightTokenCalls).toBe(3);
        expect(eventEmitter.wrongTokenCalls).toBe(0);
    });

    test('Wrong input does not move cursor', () => {
        const [eventEmitter, line] = init();

        line.handleKeyStroke("a", strokeTime);
        line.handleKeyStroke("z", strokeTime);
        line.handleKeyStroke("c", strokeTime);

        expect(eventEmitter.rightTokenCalls).toBe(1);
        expect(eventEmitter.wrongTokenCalls).toBe(2);
    });
});