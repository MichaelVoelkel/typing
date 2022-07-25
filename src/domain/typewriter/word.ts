export default class Word {
    constructor(private word: string) {
    }

    public characterAt(position: number): string {
        return this.word[position];
    }

    public string(): string {
        return this.word;
    }
    
    public length(): number {
        return this.word.length;
    }
}