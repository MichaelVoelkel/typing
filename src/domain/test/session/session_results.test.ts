import RoughSessionStatistics from "domain/session/rough_session_statistics";
import SessionResult from "domain/session/session_result";
import SessionResults from "domain/session/session_results";

describe('Session results', () => {
    test('Serialize-deserialize-serialize', () => {
        let wordPrecision = 0.5;
        let characterPrecision = 0.5;
        let wpm = 100;
        let cpm = 200;
        let words = 300;
        let characters = 400;

        const stats1 = new RoughSessionStatistics(wordPrecision, characterPrecision, wpm, cpm, words, characters);
        const session1 = new SessionResult("dict-1", new Date("2022-07-27"), stats1);

        [wordPrecision, characterPrecision, wpm, cpm, words, characters] = [0.6, 0.6, 150, 250, 350, 450];

        const stats2 = new RoughSessionStatistics(wordPrecision, characterPrecision, wpm, cpm, words, characters);
        const session2 = new SessionResult("dict-1", new Date("2022-07-27"), stats2);

        const sessions = [session1, session2];

        const serialized = new SessionResults(sessions).toObject();
        const deserialized = SessionResults.fromObject(serialized);
        const serializedAgain = deserialized.toObject();

        expect(JSON.stringify(serializedAgain)).toBe(JSON.stringify(serialized));
    });
});