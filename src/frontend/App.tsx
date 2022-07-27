import React, { useEffect, useState } from 'react'
import { stringify } from 'ts-jest';
import TypingController from '../app/typing_controller'
import parse from 'html-react-parser'
import { KeyStrokeRow, KeyStrokeTable, WordRow, WordTable } from 'domain/statistics/session_statistics';

export default function App() {
    const [typingController, setTypingController] = useState<TypingController>(new TypingController());
    const [lineText, setLineText] = useState<JSX.Element>();

    const fixLastWhitespace = (text: string) => {
        if(text[text.length - 1] == ' ') {
            return "&nbsp;" + text;
        }
        return text;
    };

    const updateLineTextObject = (newText: string, position: number) => {
        const textBefore = newText.substring(0, position);
        const textNow = newText[position];
        const textAfter = newText.substring(position + 1);
        setLineText(
            <div className="text-3xl text-center flex">
                <span className="text-right inline-block text-zinc-600 overflow-hidden flex-1 border-b border-zinc-800"
                    style={{whiteSpace: "pre", direction: "rtl"}}>{parse(fixLastWhitespace(textBefore))}</span>
                <span className="inline-block text-white overflow-hidden flex-0 border-b border-solid border-zinc-100">{textNow}</span>
                <span className="text-left inline-block w-1/3 overflow-hidden flex-1 border-b border-zinc-800">{textAfter}</span>
            </div>
        )
    };

    useEffect(() => {
        let [lineString, position] = typingController?.getLineStringAndPosition();
        updateLineTextObject(lineString, position);
        
        typingController?.lineChanged.connect(() => {
            const [newLineString, newPosition] = typingController?.getLineStringAndPosition();
            updateLineTextObject(newLineString, newPosition);
            setStrokes(typingController.getRightWrongStatistics());
            setKeyStrokeTable(typingController.getCharacterStatistics());
            setWordTable(typingController.getWordStatistics());
            setCpm(Math.round(typingController.getTotalCPM()));
            setWpm(Math.round(typingController.getTotalWPM()));
        });
    }, [setTypingController]);

    const [keyBlocked, setKeyBlocked] = useState<Record<string,boolean>>({});
    const updateBlockedKey = (pressedChar: string, blocked: boolean) => {
        const newKeyBlocked = keyBlocked;
        newKeyBlocked[pressedChar] = blocked;
        setKeyBlocked(newKeyBlocked);
    };

    useEffect(() => {
        const handleKeyStroke = (event: KeyboardEvent): any => {
            const pressedChar = event.key;
            
            if(!keyBlocked[pressedChar] && !['Shift', 'Alt', 'Meta', 'Control'].includes(pressedChar)) {
                typingController?.handleType(pressedChar);
                updateBlockedKey(pressedChar, true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const pressedChar = event.key;
            updateBlockedKey(pressedChar, false);
        };

        window.addEventListener('keydown', handleKeyStroke);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyStroke);
        }
    });

    const [strokes, setStrokes] = useState([0,0]);
    const [keyStrokeTable, setKeyStrokeTable] = useState<KeyStrokeTable>([]);
    const [wordTable, setWordTable] = useState<WordTable>([]);
    const [wpm, setWpm] = useState<number>(0);
    const [cpm, setCpm] = useState<number>(0);

    return <React.Fragment>{typingController != undefined ? 
        (<div className="flex flex-col bg-zinc-800 text-zinc-400 h-full overflow-hidden">
            <h1 className="text-4xl p-10 text-center w-full flex-0 bg-zinc-700">Type</h1>
            <div className="flex-1 flex flex-row overflow-hidden pl-4 bg-zinc-700 text-zinc-200">
                <div className="text-left flex-0 overflow-auto" style={{ minWidth: "350px"}}>
                    <table className="display-block border-collapse table-auto w-full">
                        <thead className="my-8">
                            <tr>
                                <th className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 sticky top-0">Character</th>
                                <th className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 text-right sticky top-0">Precision</th>
                                <th className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 text-right sticky top-0 pr-8">Average time 1/10s</th>
                            </tr>
                        </thead>
                        <tbody>
                        { keyStrokeTable.map((row: KeyStrokeRow) => {
                            return <tr key={row.character}>
                                    <td className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 pl-8">{row.character}</td>
                                    <td className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 pl-8 text-right">
                                        {(row.precision * 100).toFixed(2)}%
                                    </td>
                                    <td className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 pl-8 text-right pr-8">
                                        {(row.averageTime / 10).toFixed(1)}
                                    </td>
                                </tr>;})
                        }
                        </tbody>
                    </table>
                </div>
                <div className="bg-zinc-800 h-full text-zinc-400 flex-1 text-center" style={{whiteSpace: "pre", overflow: "hidden", textOverflow: "ellipsis"}}>
                    <br/>
                    {lineText}
                    <br/><br/><br/>
                    <table className="table-auto inline">
                        <tbody>
                            <tr><td className="p-2">Right strokes:</td><td className="p-2 text-right">{strokes[0]}</td></tr>
                            <tr><td className="p-2">Wrong strokes:</td><td className="p-2 text-right">{strokes[1]}</td></tr>
                            <tr><td className="p-2">Dictionary words:</td><td className="p-2 text-right">{wordTable.length}</td></tr>
                            <tr><td className="p-2">WPM/CPM:</td><td className="p-2 text-right">{wpm} / {cpm}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex-0 overflow-auto bg-zinc-700" style={{overflow: "auto", minWidth: "350px"}}>
                    <table className="display-block border-collapse table-auto w-full">
                        <thead className="my-8">
                            <tr>
                                <th className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 sticky top-0">Word</th>
                                <th className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 text-right sticky top-0">Precision</th>
                                <th className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 text-right sticky top-0 pr-8">Average time 1/10s</th>
                            </tr>
                        </thead>
                        <tbody>
                        { wordTable.map((row: WordRow) => {
                            return <tr key={row.word}>
                                    <td className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 pl-8">{row.word}</td>
                                    <td className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 pl-8 text-right">
                                        {(row.precision * 100).toFixed(2)}%
                                    </td>
                                    <td className="border-b bg-zinc-700 border-zinc-800 text-zinc-200 p-2 pl-8 text-right pr-8">
                                        {(row.averageTime / 10).toFixed(1)}
                                    </td>
                                </tr>;})
                        }
                        </tbody>
                    </table>
                </div>
            </div>

            
            
            
            
            
            
            
        </div>)
        :
            <div>Loading</div>
        }
        </React.Fragment>
}