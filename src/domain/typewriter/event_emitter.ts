export default interface EventEmitter {
    wrongToken(expected: string, actual: string, timeInUs: number): void;
    rightToken(actual: string, timeInUs: number): void;
}