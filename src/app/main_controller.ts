import SessionResult from "domain/session/session_result";
import SessionResults from "domain/session/session_results";
import SessionResultsRepository from "domain/session/session_results_repository";
import TypingController from "./typing_controller";

export default class MainController {
    private sessionResults: SessionResults;

    constructor(private sessionResultsRepository: SessionResultsRepository) {
        this.sessionResults = this.sessionResultsRepository.loadSessionResults();
    }

    startSession(dictID: string): TypingController {
        const controller = new TypingController(dictID);

        controller.sessionFinished.connect((result: SessionResult) => this.addSessionResult(result));

        return controller;
    }

    private addSessionResult(result: SessionResult) {
        this.sessionResults.addSessionResult(result);
        this.sessionResultsRepository.storeSessionResults(this.sessionResults);
    }

    getSessionResultRows() {
        return this.sessionResults.toObject();
    }
}