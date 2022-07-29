import SessionResults from "./session_results";

export default interface SessionResultsRepository {
    storeSessionResults(results: SessionResults): void;
    loadSessionResults(): SessionResults;
};