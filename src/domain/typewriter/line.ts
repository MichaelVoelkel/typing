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

    getLineStringAndCursorPosition(): [lineString: string, cursorPosition: number] {
        let cursorPosition = 0;
        let lineString: string = "";
        const spaceSize = 1;

        console.log("MV: current " + this.currentWordIdx);

        for(let wordIdx = 0; wordIdx < this.words.length; ++wordIdx) {
            lineString += this.words[wordIdx].string() + " ";

            if(wordIdx < this.currentWordIdx) {
                cursorPosition += this.words[wordIdx].length() + spaceSize;
            } else if(wordIdx == this.currentWordIdx) {
                cursorPosition += this.currentPositionInWordIdx;
            }
        }

        console.log("MV: pos " + cursorPosition);

        return [lineString, cursorPosition];
    }

    setEventEmitter(eventEmitter: EventEmitter): void {
        this.eventEmitter = eventEmitter;
    }

    handleKeyStroke(typedCharacter: string, timeInMs: number): void {
        let correctCharacter: string;
        if(this.atEndOfWord()) {
            correctCharacter = ' ';
        } else {
            correctCharacter = this.words[this.currentWordIdx].characterAt(this.currentPositionInWordIdx);
        }
        
        if (typedCharacter === correctCharacter) {
            this.proceedCursor();
            this.eventEmitter?.rightToken(correctCharacter, timeInMs);
        } else {
            this.eventEmitter?.wrongToken(correctCharacter, typedCharacter, timeInMs);
        }
    }

    atEndOfWord(): boolean {
        return this.currentPositionInWordIdx == this.words[this.currentWordIdx].length();
    }

    proceedCursor(): void {
        ++this.currentPositionInWordIdx;

        // position at end of word means space is needed
        if(this.currentPositionInWordIdx > this.words[this.currentWordIdx].length()) {
            this.currentPositionInWordIdx = 0;
            ++this.currentWordIdx;
        }
    }
}