import React, { useEffect, useState } from 'react'
import { stringify } from 'ts-jest';
import TypingController from '../app/typing_controller'
import parse from 'html-react-parser'

export default function App() {
    const [typingController, setTypingController] = useState<TypingController>(new TypingController());
    const [lineText, setLineText] = useState<JSX.Element>();

    const fixLastWhitespace = (text: string) => {
        if(text[text.length - 1] == ' ') {
            return '&nbsp;' + text;
        }
        return text;
    };

    const updateLineTextObject = (newText: string, position: number) => {
        const textBefore = newText.substring(0, position);
        const textNow = newText[position];
        const textAfter = newText.substring(position + 1);
        setLineText(
            <>
                <span className="text-right inline-block text-zinc-600 w-1/5 overflow-hidden"
                    style={{whiteSpace: "pre", direction: "rtl"}}>{parse(fixLastWhitespace(textBefore))}</span>
                <span className="inline-block text-white overflow-hidden">{textNow}</span>
                <span className="text-left inline-block w-1/3 overflow-hidden">{textAfter}</span>
            </>
        )
    };

    useEffect(() => {
        let [lineString, position] = typingController?.getLineStringAndPosition();
        updateLineTextObject(lineString, position);
        
        typingController?.lineChanged.connect(() => {
            const [newLineString, newPosition] = typingController?.getLineStringAndPosition();
            updateLineTextObject(newLineString, newPosition);
            setStrokes(typingController.getRightWrongStatistics());
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

    return <React.Fragment>{typingController != undefined ? 
        (<div className="bg-zinc-800 h-full text-zinc-400" style={{whiteSpace: "pre", overflow: "hidden", textOverflow: "ellipsis"}}>
            <h1 className="text-4xl p-10 text-center w-full">Type</h1>
            <div className="text-2xl text-center w-full">{lineText}</div>
            <div className="text-center m-10">
            <span>Right strokes: {strokes[0]}</span>
            <br/>
            <span>Wrong strokes: {strokes[1]}</span>
            </div>
        </div>)
        :
            <div>Loading</div>
        }
        </React.Fragment>
}