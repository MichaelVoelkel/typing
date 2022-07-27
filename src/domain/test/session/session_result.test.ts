import RoughSessionStatistics from "domain/session/rough_session_statistics";
import SessionResult from "domain/session/session_result";

describe('Session object serialization test', () => {
    test('Serialize-deserialize-serialize', () => {
        const wordPrecision = 0.5;
        const characterPrecision = 0.5;
        const wpm = 100;
        const cpm = 200;
        const words = 300;
        const characters = 400;

        const stats = new RoughSessionStatistics(wordPrecision, characterPrecision, wpm, cpm, words, characters);
        const session = new SessionResult("dict-1", new Date("2022-07-27"), stats);

        const asObject = session.toObject();
        const fromObject: SessionResult = SessionResult.fromObject(asObject);

        expect(JSON.stringify(fromObject.toObject())).toBe(JSON.stringify(asObject));
    });
});