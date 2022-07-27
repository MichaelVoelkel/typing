import RoughSessionStatistics from "./rough_session_statistics";

export default class SessionResult {
    constructor(
        private dictionaryID: string,
        private date: Date,
        private statistics: RoughSessionStatistics) {
        }

    toObject(): Record<string, any> {
        return {
            dictionaryID: this.dictionaryID,
            date: this.date,
            statistics: this.statistics.toObject()
        };
    }

    static fromObject(obj: Record<string, any>): SessionResult {
        return new SessionResult(
            obj.dictionaryID,
            obj.date,
            RoughSessionStatistics.fromObject(obj.statistics)
        );
    }
}