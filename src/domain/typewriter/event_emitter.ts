export default interface EventEmitter {
    wrongToken(expected: string, actual: string, timeInMs: number): void;
    rightToken(actual: string, timeInMs: number): void;
}