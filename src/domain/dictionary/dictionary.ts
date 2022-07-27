import Word from "domain/typewriter/word";
import shuffleArray from "./arrayHelpers/shuffleArray";

export default class Dictionary {
    private words: Word[] = [];

    constructor(private id: string, label: string, wordStrings: string[]) {

        let commonEnglishWords = Object.values(wordStrings);

        commonEnglishWords.forEach((word: string) => this.words.push(new Word(word)));
        shuffleArray(this.words);
    }

    getWords(): Word[] {
        return this.words;
    }
};