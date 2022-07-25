export default interface EventEmitter {
    rightToken(actual: string, timeInMs: number): void;
    wrongToken(expected: string, actual: string, timeInMs: number): void;
    rightWord(word: string, timeInMs: number): void;
    wrongWord(word: string, timeInMs: number): void;
}