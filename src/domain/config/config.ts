export default class Config {
    public randomizeWords: boolean = true;
    public wordTimeInMsCap: number = 5 * 1000;

    getWordTimeInMsCap(): number {
        return 5 * 1000;
    }

    getRandomizeWords(): boolean {
        return this.randomizeWords;
    }
}