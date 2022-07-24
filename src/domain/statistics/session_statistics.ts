export default class SessionStatistics {
    private rightKeyStrokes: number = 0;
    private wrongKeyStrokes: number = 0;

    addRightKeyStroke(): void {
        ++this.rightKeyStrokes;
    }

    addWrongKeyStroke(): void {
        ++this.wrongKeyStrokes;
    }

    getRightKeyStrokes(): number {
        return this.rightKeyStrokes;
    }

    getWrongKeyStrokes(): number {
        return this.wrongKeyStrokes;
    }
}