import EventEmitter from "./event_emitter";
import Word from "./word";

// one (potentially very long, UI should display it nicely) line with many words
// that might repeat
export default class Line {
    private eventEmitter?: EventEmitter;

    constructor(
        private words: Word[],
        private currentWordIdx: number,
        private currentPositionInWordIdx: number) {
    }

    setEventEmitter(eventEmitter: EventEmitter): void {
        this.eventEmitter = eventEmitter;
    }

    handleKeyStroke(typedCharacter: string, timeInUs: number): void {
        const correctCharacter = this.words[this.currentWordIdx].characterAt(this.currentPositionInWordIdx);

        if (typedCharacter === correctCharacter) {
            this.proceedCursor();
            this.eventEmitter?.rightToken(correctCharacter, timeInUs);
        } else {
            this.eventEmitter?.wrongToken(correctCharacter, typedCharacter, timeInUs);
        }
    }

    proceedCursor(): void {
        ++this.currentPositionInWordIdx;

        if(this.currentPositionInWordIdx >= this.words[this.currentWordIdx].length()) {
            this.currentPositionInWordIdx = 0;
            ++this.currentWordIdx;
        }
    }
}