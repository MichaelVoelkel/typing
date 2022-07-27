interface Stats {
    rightStrokes: number;
    wrongStrokes: number;
    precision: number;
    averageTime: number;
};

export interface KeyStrokeRow extends Stats {
    character: string;
};

export type KeyStrokeTable = KeyStrokeRow[];
export interface WordRow extends Stats {
    word: string;
};

export type WordTable = WordRow[];

export default class DetailedSessionStatistics {
    private rightKeyStrokes: number = 0;
    private wrongKeyStrokes: number = 0;
    private rightKeyStrokesByCharacter: Record<string, number> = {};
    private wrongKeyStrokesByCharacter: Record<string, number> = {};
    private rightKeyStrokeTimesByCharacter: Record<string, number[]> = {};
    private rightWordsByWord: Record<string, number> = {};
    private completedWords: number = 0;
    private wrongWordsByWord: Record<string, number> = {};
    private wordTimesByWord: Record<string, number[]> = {};
    private cumulativeKeyStrokeTime: number = 0;
    private cumulativeWordTime: number = 0;

    addRightWord(word: string, timeInMs: number): void {
        this.rightWordsByWord[word] = this.rightWordsByWord[word] + 1 || 1;
        this.addCommonWordStats(word, timeInMs);
    }

    addWrongWord(word:string, timeInMs: number): void {
        this.wrongWordsByWord[word] = this.wrongWordsByWord[word] + 1 || 1;
        this.addCommonWordStats(word, timeInMs);
    }

    private addCommonWordStats(word: string, timeInMs: number): void {
        this.wordTimesByWord[word] = this.wordTimesByWord[word] || [];
        this.wordTimesByWord[word].push(timeInMs);
        this.cumulativeWordTime += timeInMs;
        ++this.completedWords;
    }

    addRightKeyStroke(character: string, timeInMs: number): void {
        ++this.rightKeyStrokes;
        this.rightKeyStrokesByCharacter[character] = this.rightKeyStrokesByCharacter[character] + 1 || 1;
        this.rightKeyStrokeTimesByCharacter[character] = this.rightKeyStrokeTimesByCharacter[character] || [];
        this.rightKeyStrokeTimesByCharacter[character].push(timeInMs);

        this.cumulativeKeyStrokeTime += timeInMs;
    }

    addWrongKeyStroke(character: string, timeInMs: number): void {
        ++this.wrongKeyStrokes;
        this.wrongKeyStrokesByCharacter[character] = this.wrongKeyStrokesByCharacter[character] + 1 || 1;
        this.cumulativeKeyStrokeTime += timeInMs;
    }

    getRightKeyStrokes(): number {
        return this.rightKeyStrokes;
    }

    getWrongKeyStrokes(): number {
        return this.wrongKeyStrokes;
    }

    private getTable<T extends Stats>(
        rightOnes: Record<string, number>,
        wrongOnes: Record<string, number>,
        times: Record<string, number[]>,
        keyName: string): T[] {

        const allKeys = new Set([
            ...Object.keys(rightOnes),
            ...Object.keys(wrongOnes)
        ]);

        const table: T[] = [];

        allKeys.forEach((key: string) => {
            const rightStrokes = rightOnes[key] || 0;
            const wrongStrokes = wrongOnes[key] || 0;
            const allTimes = times[key] || [];

            const averageTime = allTimes.reduce((aggregateValue: number, currentValue: number) =>
                aggregateValue + currentValue, 0) / allTimes.length;

            table.push({
                [keyName]: key as string,
                rightStrokes: rightStrokes,
                wrongStrokes: wrongStrokes,
                precision: rightStrokes / (rightStrokes + wrongStrokes),
                averageTime: averageTime
            } as unknown as T);
        });

        table.sort((line1: T, line2: T): number => {
            const normalizer = 500000;
            let order = (line1.precision - line2.precision) * normalizer;

            if(!isNaN(line1.averageTime) && !isNaN(line2.averageTime)) {
                order += line2.averageTime - line1.averageTime;   
            }

            return order;
        });

        return table;
    }

    getKeyStrokeTable(): KeyStrokeTable {
        return this.getTable<KeyStrokeRow>(
            this.rightKeyStrokesByCharacter,
            this.wrongKeyStrokesByCharacter,
            this.rightKeyStrokeTimesByCharacter,
            "character");
    }

    getWordTable(): WordTable {
        return this.getTable<WordRow>(
            this.rightWordsByWord,
            this.wrongWordsByWord,
            this.wordTimesByWord,
            "word");
    }

    getTotalWPM(): number {
        const msPerMinute = 60 * 1000;
        return this.completedWords / this.cumulativeWordTime * msPerMinute;
    }

    getTotalCPM(): number {
        const msPerMinute = 60 * 1000;
        return (this.rightKeyStrokes + this.wrongKeyStrokes) / this.cumulativeKeyStrokeTime * msPerMinute;
    }

    getRightWords(): number {
        return Object.values(this.rightWordsByWord).reduce((sum: number, value: number) => sum + value, 0);
    }

    getWrongWords(): number {
        return Object.values(this.wrongWordsByWord).reduce((sum: number, value: number) => sum + value, 0);
    }

    getTotalWordPrecision(): number {
        const rightWords = this.getRightWords();
        return rightWords / (rightWords + this.getWrongWords());
    }

    getRightCharacters(): number {
        return Object.values(this.rightKeyStrokesByCharacter).reduce((sum: number, value: number) => sum + value, 0);
    }

    getWrongCharacters(): number {
        return Object.values(this.wrongKeyStrokesByCharacter).reduce((sum: number, value: number) => sum + value, 0);
    }

    getTotalCharacterPrecision(): number {
        const rightCharacters: number = this.getRightCharacters();
        return rightCharacters / (rightCharacters + this.getWrongCharacters());
    }

    getTotalTypedWords(): number {
        return this.getRightWords() + this.getWrongWords();
    }

    getTotalTypedCharacters(): number {
        return this.getRightCharacters() + this.getWrongCharacters();
    }
}