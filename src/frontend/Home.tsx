import MainController from "app/main_controller";
import TypingController from "app/typing_controller";
import { allDictionaries } from "domain/dictionary/dictionaries";
import Dictionary from "domain/dictionary/dictionary";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home(props: any) {
    const {mainController}: {mainController: MainController} = props;

    return <div className="flex flex-col bg-zinc-800 text-zinc-400 h-full overflow-hidden">
        <h1 className="text-4xl p-10 text-center w-full flex-0 bg-zinc-700">Type</h1>
        <div className="flex-1 flex flex-row overflow-hidden pl-4 bg-zinc-700 text-zinc-200 text-center">
            <ul className="w-full">
                {
                    allDictionaries.map((dict: Dictionary) => <li key={dict.getID()}>
                        <Link to={"/type/" + dict.getID()}>{dict.getLabel()}</Link>
                    </li> )
                }
            </ul>
        </div>

        <table className="table-auto">
            <tbody>
                {
                    mainController.getSessionResultRows().map((value: Record<string, any>) => 
                        <tr key={value.date.toString()}>
                            <td>{value.dictionaryID}</td>
                            <td>{new Intl.DateTimeFormat('de-DE').format(new Date(value.date))}</td>
                            <td>{value.statistics.wordPrecision}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    </div>
}