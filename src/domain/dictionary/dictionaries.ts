import Dictionary from "./dictionary";
import * as wordlist1k from 'data/english-words-1k.json';
import * as wordlist10percent from 'data/english-words-10percent.json';

export const english1kWordsDictionary = new Dictionary("en-1k", "English 1k", wordlist1k);
export const english10PercentDictionary = new Dictionary("en-10%", "English 10%", wordlist10percent);

export const allDictionaries = [
    english1kWordsDictionary,
    english10PercentDictionary
];