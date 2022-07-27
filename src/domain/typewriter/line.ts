import shuffleArray from "domain/arrayHelpers/shuffleArray";
import Config from "domain/config/config";
import EventEmitter from "./event_emitter";
import Word from "./word";

// one (potentially very long, UI should display it nicely) line with many words
// that might repeat
export default class Line {
    private eventEmitter?: EventEmitter;
    private cumulativeStrokeTimesInWordInMs: number = 0;
    private errorsInWordSoFar: boolean = false;
    private words: Word[] = [];

    constructor(
        private config: Config,
        private originalWords: Word[],
        private currentWordIdx: number,
        private currentPositionInWordIdx: number) {
        
        this.originalWords = originalWords;

        this.addWordPermutationToWords();
    }

    private addWordPermutationToWords(): void {
        shuffleArray(this.originalWords);

        this.words = this.words.concat(this.originalWords);
    }

    getLineStringAndCursorPosition(): [lineString: string, cursorPosition: number] {
        let cursorPosition = 0;
        let lineString: string = "";
        const spaceSize = 1;

        for(let wordIdx = 0; wordIdx < this.words.length; ++wordIdx) {
            lineString += this.words[wordIdx].string() + " ";

            if(wordIdx < this.currentWordIdx) {
                cursorPosition += this.words[wordIdx].length() + spaceSize;
            } else if(wordIdx == this.currentWordIdx) {
                cursorPosition += this.currentPositionInWordIdx;
            }
        }

        return [lineString, cursorPosition];
    }

    setEventEmitter(eventEmitter: EventEmitter): void {
        this.eventEmitter = eventEmitter;
    }

    handleKeyStroke(typedCharacter: string, timeInMs: number): void {
        this.cumulativeStrokeTimesInWordInMs += timeInMs;

        let correctCharacter: string;
        if(this.atEndOfWord()) {
            correctCharacter = ' ';
        } else {
            correctCharacter = this.words[this.currentWordIdx].characterAt(this.currentPositionInWordIdx);
        }
        
        if (typedCharacter === correctCharacter) {
            this.proceedCursorAndPotentiallyWord();
            this.eventEmitter?.rightToken(correctCharacter, timeInMs);
        } else {
            this.errorsInWordSoFar = true;
            this.eventEmitter?.wrongToken(correctCharacter, typedCharacter, timeInMs);
        }
    }

    atEndOfWord(): boolean {
        return this.currentPositionInWordIdx == this.words[this.currentWordIdx].length();
    }

    proceedCursorAndPotentiallyWord(): void {
        ++this.currentPositionInWordIdx;

        // position at end of word means space is needed
        if(this.currentPositionInWordIdx > this.words[this.currentWordIdx].length()) {
            const cappedStrokeTime = Math.min(this.cumulativeStrokeTimesInWordInMs, this.config.wordTimeInMsCap());

            if(this.errorsInWordSoFar) {
                this.eventEmitter?.wrongWord(this.words[this.currentWordIdx].string(), cappedStrokeTime);
            } else {
                this.eventEmitter?.rightWord(this.words[this.currentWordIdx].string(), cappedStrokeTime);
            }

            this.currentPositionInWordIdx = 0;
            ++this.currentWordIdx;
            this.cumulativeStrokeTimesInWordInMs = 0;
            this.errorsInWordSoFar = false;

            this.addWordsIfNeeded();
        }
    }

    private addWordsIfNeeded(): void {
        const leftWordsWhenToAddNewWords = 20;
        if(this.currentWordIdx > this.words.length - leftWordsWhenToAddNewWords) {
            this.addWordPermutationToWords();
        }
    }
}