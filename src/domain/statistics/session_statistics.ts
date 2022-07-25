import { stringify } from "ts-jest";

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

export default class SessionStatistics {
    private rightKeyStrokes: number = 0;
    private wrongKeyStrokes: number = 0;
    private rightKeyStrokesByCharacter: Record<string, number> = {};
    private wrongKeyStrokesByCharacter: Record<string, number> = {};
    private rightKeyStrokeTimesByCharacter: Record<string, number[]> = {};
    private rightWordsByWord: Record<string, number> = {};
    private wrongWordsByWord: Record<string, number> = {};
    private rightWordTimesByWord: Record<string, number[]> = {};

    addRightWord(word: string, timeInMs: number): void {
        this.rightWordsByWord[word] = this.rightWordsByWord[word] || 1;

        this.rightWordTimesByWord[word] = this.rightWordTimesByWord[word] || [];
        this.rightWordTimesByWord[word].push(timeInMs);
    }

    addWrongWord(word:string, _timeInMs: number): void {
        this.wrongWordsByWord[word] = this.wrongWordsByWord[word] || 1;
    }

    addRightKeyStroke(character: string, timeInMs: number): void {
        ++this.rightKeyStrokes;
        this.rightKeyStrokesByCharacter[character] = this.rightKeyStrokesByCharacter[character] + 1 || 1;
        this.rightKeyStrokeTimesByCharacter[character] = this.rightKeyStrokeTimesByCharacter[character] || [];
        this.rightKeyStrokeTimesByCharacter[character].push(timeInMs);
    }

    addWrongKeyStroke(character: string, _timeInMs: number): void {
        ++this.wrongKeyStrokes;
        this.wrongKeyStrokesByCharacter[character] = this.wrongKeyStrokesByCharacter[character]+ 1 || 1;
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
            return line1.precision - line2.precision;
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
            this.rightWordTimesByWord,
            "word");
    }
}