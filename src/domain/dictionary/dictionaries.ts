import Dictionary from "./dictionary";
import wordlist2 from 'data/english-words-2.json';
import wordlist100 from 'data/english-words-100.json';
import wordlist1k from 'data/english-words-1k.json';
import wordlist10percent from 'data/english-words-10percent.json';

export const english2WordsDictionary = new Dictionary("en-2", "English 2", wordlist2);
export const english100WordsDictionary = new Dictionary("en-100", "English 100", wordlist100);
export const english1kWordsDictionary = new Dictionary("en-1k", "English 1k", wordlist1k);
export const english10PercentDictionary = new Dictionary("en-10%", "English 10%", wordlist10percent);

export const allDictionaries = [
    english2WordsDictionary,
    english100WordsDictionary,
    english1kWordsDictionary,
    english10PercentDictionary
];