import Config from "domain/config/config";
import EventEmitter from "domain/typewriter/event_emitter"
import Line from "domain/typewriter/line";
import Word from "domain/typewriter/word";

const strokeTime = 100;
const words = [new Word("abc"), new Word("defg"), new Word("hijkl")];
const wordsAsString = "abc defg hijkl ";

function init(): [EventEmitterMock, Line] {
    const eventEmitter = new EventEmitterMock();
    const line = new Line(new Config, words, 0, 0);
    line.setEventEmitter(eventEmitter);

    return [eventEmitter, line];
}

function multiStroke(line: Line, strokes: string) {
    strokes.split('').forEach((char: string) => {
        line.handleKeyStroke(char, strokeTime);
    });
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

    rightWord(word: string, timeInMs: number): void {
        // TBD
    }
    wrongWord(word: string, timeInMs: number): void {
        // TBD
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
        line.handleKeyStroke(" ", strokeTime);
        line.handleKeyStroke("d", strokeTime);

        expect(eventEmitter.rightTokenCalls).toBe(5);
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

describe('Test line string and position', () => {
    test('Right complete string and position', () => {
        const [_eventEmitter, line] = init();

        line.handleKeyStroke("a", strokeTime);
        line.handleKeyStroke("b", strokeTime);
        line.handleKeyStroke("c", strokeTime);
        line.handleKeyStroke(" ", strokeTime);
        line.handleKeyStroke("d", strokeTime);
        line.handleKeyStroke("e", strokeTime);

        const [lineString, position] = line.getLineStringAndCursorPosition();
        expect(lineString).toBe(wordsAsString);
        expect(position).toBe(6);
    });

    test('Right complete string', () => {
        const [_eventEmitter, line] = init();

        line.handleKeyStroke("a", strokeTime);
        line.handleKeyStroke("b", strokeTime);
        line.handleKeyStroke("c", strokeTime);
        line.handleKeyStroke(" ", strokeTime);
        line.handleKeyStroke("d", strokeTime);
        line.handleKeyStroke("Z", strokeTime);

        const [lineString, position] = line.getLineStringAndCursorPosition();
        expect(lineString).toBe(wordsAsString);
        expect(position).toBe(5);
    });

    test('Test multiple words', () => {
        const eventEmitter = new EventEmitterMock();
        const line = new Line(new Config, [new Word("a"), new Word("abilities"), new Word("ability"), new Word("able")], 0, 0);
        line.setEventEmitter(eventEmitter);

        const stroken = "a abilities ability";
        multiStroke(line, stroken);

        const [_lineString, position] = line.getLineStringAndCursorPosition();
        expect(position).toBe(stroken.length);
    });
});