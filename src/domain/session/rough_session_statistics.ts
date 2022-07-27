import DetailedSessionStatistics from "./detailed_session_statistics";
import SessionResult from "./session_result";

export default class RoughSessionStatistics {
    constructor(
        private wordPrecision: number,
        private characterPrecision: number,
        private wpm: number,
        private cpm: number,
        private totalTypedWords: number,
        private totalTypedCharacters: number
    ) {
    }

    static createFromDetailedSessionStatistics(detailedStatistics: DetailedSessionStatistics): RoughSessionStatistics {
        return new RoughSessionStatistics(
            detailedStatistics.getTotalWordPrecision(),
            detailedStatistics.getTotalCharacterPrecision(),
            detailedStatistics.getTotalWPM(),
            detailedStatistics.getTotalCPM(),
            detailedStatistics.getTotalTypedWords(),
            detailedStatistics.getTotalTypedCharacters()
        );
    }

    getWordPrecision(): number {
        return this.wordPrecision;
    }

    getCharacterPrecision(): number {
        return this.characterPrecision;
    }

    getTotalWPM(): number {
        return this.wpm;
    }

    getTotalCPM(): number {
        return this.cpm;
    }

    getTotalTypedWords(): number {
        return this.totalTypedWords;
    }

    getTotalTypedCharacters(): number {
        return this.totalTypedCharacters;
    }

    toObject(): Record<string, any> {
        return this;
    }

    static fromObject(obj: Record<string, any>): RoughSessionStatistics {
        return new RoughSessionStatistics(
            obj.wordPrecision,
            obj.characterPrecision,
            obj.wpm,
            obj.cpm,
            obj.totalTypedWords,
            obj.totalTypedCharacters
        );
    }
}