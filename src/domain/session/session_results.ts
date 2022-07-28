import SessionResult from "./session_result";

export default class SessionResults {
    constructor(private results: SessionResult[]) {
    }

    addSessionResult(result: SessionResult) {
        this.results.push(result);
    }

    toObject(): Record<string, any>[] {
        const results: Record<string, any>[] = [];

        this.results.forEach((result: SessionResult) => {
            results.push(result.toObject());
        })

        return results;
    }

    static fromObject(obj: Record<string, any>[]): SessionResults {
        const results: SessionResult[] = [];

        obj.forEach((objResult: any) => results.push(SessionResult.fromObject(objResult)));

        return new SessionResults(results);
    }
}