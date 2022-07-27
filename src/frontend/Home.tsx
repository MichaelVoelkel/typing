import { allDictionaries } from "domain/dictionary/dictionaries";
import Dictionary from "domain/dictionary/dictionary";
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
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
    </div>
}