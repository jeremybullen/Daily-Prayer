import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BOOKS = [
  { bookid: 1, name: 'Genesis' },
  { bookid: 2, name: 'Exodus' },
  { bookid: 3, name: 'Leviticus' },
  { bookid: 4, name: 'Numbers' },
  { bookid: 5, name: 'Deuteronomy' },
  { bookid: 6, name: 'Joshua' },
  { bookid: 7, name: 'Judges' },
  { bookid: 8, name: 'Ruth' },
  { bookid: 9, name: '1 Samuel' },
  { bookid: 10, name: '2 Samuel' },
  { bookid: 11, name: '1 Kings' },
  { bookid: 12, name: '2 Kings' },
  { bookid: 13, name: '1 Chronicles' },
  { bookid: 14, name: '2 Chronicles' },
  { bookid: 15, name: 'Ezra' },
  { bookid: 16, name: 'Nehemiah' },
  { bookid: 17, name: 'Esther' },
  { bookid: 18, name: 'Job' },
  { bookid: 19, name: 'Psalm' },
  { bookid: 20, name: 'Proverbs' },
  { bookid: 21, name: 'Ecclesiastes' },
  { bookid: 22, name: 'Song of Solomon' },
  { bookid: 23, name: 'Isaiah' },
  { bookid: 24, name: 'Jeremiah' },
  { bookid: 25, name: 'Lamentations' },
  { bookid: 26, name: 'Ezekiel' },
  { bookid: 27, name: 'Daniel' },
  { bookid: 28, name: 'Hosea' },
  { bookid: 29, name: 'Joel' },
  { bookid: 30, name: 'Amos' },
  { bookid: 31, name: 'Obadiah' },
  { bookid: 32, name: 'Jonah' },
  { bookid: 33, name: 'Micah' },
  { bookid: 34, name: 'Nahum' },
  { bookid: 35, name: 'Habakkuk' },
  { bookid: 36, name: 'Zephaniah' },
  { bookid: 37, name: 'Haggai' },
  { bookid: 38, name: 'Zechariah' },
  { bookid: 39, name: 'Malachi' },
  { bookid: 40, name: 'Matthew' },
  { bookid: 41, name: 'Mark' },
  { bookid: 42, name: 'Luke' },
  { bookid: 43, name: 'John' },
  { bookid: 44, name: 'Acts' },
  { bookid: 45, name: 'Romans' },
  { bookid: 46, name: '1 Corinthians' },
  { bookid: 47, name: '2 Corinthians' },
  { bookid: 48, name: 'Galatians' },
  { bookid: 49, name: 'Ephesians' },
  { bookid: 50, name: 'Philippians' },
  { bookid: 51, name: 'Colossians' },
  { bookid: 52, name: '1 Thessalonians' },
  { bookid: 53, name: '2 Thessalonians' },
  { bookid: 54, name: '1 Timothy' },
  { bookid: 55, name: '2 Timothy' },
  { bookid: 56, name: 'Titus' },
  { bookid: 57, name: 'Philemon' },
  { bookid: 58, name: 'Hebrews' },
  { bookid: 59, name: 'James' },
  { bookid: 60, name: '1 Peter' },
  { bookid: 61, name: '2 Peter' },
  { bookid: 62, name: '1 John' },
  { bookid: 63, name: '2 John' },
  { bookid: 64, name: '3 John' },
  { bookid: 65, name: 'Jude' },
  { bookid: 66, name: 'Revelation' }
];

interface Verse {
    pk: number,
    verse: number,
    text: string
}

export function BibleReading({ reference, onLoadingChange, translation = 'ESV', fontSizeClass = 'text-lg md:text-xl' }: { reference: string, onLoadingChange?: (loading: boolean) => void, translation?: 'ESV' | 'BSB' | 'KJV', fontSizeClass?: string }) {
  const [verses, setVerses] = useState<{chap: number, verse: number, text: string}[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;

    const fetchBible = async () => {
      setLoading(true);
      if (onLoadingChange) onLoadingChange(true);
      setError(null);
      setVerses(null);

      try {
        const regex = /^(.+?)\s+(\d+)(?::(\d+))?(?:\s*-\s*(?:(\d+):)?(\d+))?$/;
        const match = reference.match(regex);
        if (!match) throw new Error("Could not parse bible reference: " + reference);

        const bookOpt = BOOKS.find(b => b.name === match[1]);
        if (!bookOpt) throw new Error("Could not identify book: " + match[1]);

        const singleChapterBooks = ["Obadiah", "Philemon", "2 John", "3 John", "Jude"];
        let startChapter: number, startVerse: number, endChapter: number, endVerse: number;

        if (singleChapterBooks.includes(bookOpt.name) && !match[3]) {
            startChapter = 1;
            endChapter = 1;
            startVerse = parseInt(match[2]);
            endVerse = match[5] ? parseInt(match[5]) : startVerse;
        } else {
            startChapter = parseInt(match[2]);
            startVerse = match[3] ? parseInt(match[3]) : 1;
            endChapter = startChapter;
            endVerse = 999;

            if (match[5]) { 
                if (match[4]) { 
                    endChapter = parseInt(match[4]);
                    endVerse = parseInt(match[5]);
                } else if (match[3]) { 
                    endChapter = startChapter;
                    endVerse = parseInt(match[5]);
                } else { 
                    endChapter = parseInt(match[5]);
                    endVerse = 999;
                }
            } else if (match[3]) {
                endVerse = startVerse;
            }
        }

        const loadedVerses: {chap: number, verse: number, text: string}[] = [];
        
        for (let chap = startChapter; chap <= endChapter; chap++) {
            const response = await fetch(`https://bolls.life/get-chapter/${translation}/${bookOpt.bookid}/${chap}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch chapter text");
            }
            const chapVerses = await response.json() as Verse[];
            
            let filtered = chapVerses;
            if (chap === startChapter) {
                filtered = filtered.filter(v => v.verse >= startVerse);
            }
            if (chap === endChapter) {
                filtered = filtered.filter(v => v.verse <= endVerse);
            }
            
            filtered.forEach(v => {
                loadedVerses.push({
                    chap,
                    verse: v.verse,
                    // Bolls API sometimes returns HTML tags in text, and KJV has Strong's under <S> tags
                    text: v.text.replace(/<S>.*?<\/S>/gi, '').replace(/<sup.*?>.*?<\/sup>/gi, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').replace(/\s+([,.!?;:])/g, '$1').trim()
                });
            });
        }
        
        if (active) {
          setVerses(loadedVerses);
          setLoading(false);
          if (onLoadingChange) onLoadingChange(false);
        }
      } catch (err) {
        if (active) {
          setError("Unable to load Bible text. Please read from your personal Bible.");
          setLoading(false);
          if (onLoadingChange) onLoadingChange(false);
        }
      }
    };

    fetchBible();

    return () => {
      active = false;
    };
  }, [reference, translation, onLoadingChange]);

  return (
    <>
      {loading ? (
        <motion.div 
          key="loading"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.3 }}
          className="animate-pulse space-y-4 mt-8"
        >
          <div className="h-5 bg-slate-200/50 dark:bg-slate-700/30 rounded w-5/6"></div>
          <div className="h-5 bg-slate-200/50 dark:bg-slate-700/30 rounded w-full"></div>
          <div className="h-5 bg-slate-200/50 dark:bg-slate-700/30 rounded w-11/12"></div>
          <div className="h-5 bg-slate-200/50 dark:bg-slate-700/30 rounded w-4/6"></div>
          <div className="h-5 bg-slate-200/50 dark:bg-slate-700/30 rounded w-full"></div>
          <div className="h-5 bg-slate-200/50 dark:bg-slate-700/30 rounded w-5/6"></div>
        </motion.div>
      ) : error ? (
        <motion.div 
          key="error"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center mt-12"
        >
          <p className="font-serif italic text-xl leading-relaxed text-slate-500 dark:text-slate-500">
            {error}
          </p>
        </motion.div>
      ) : (
        <motion.div 
          key={reference}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`font-serif text-slate-700 dark:text-slate-300 leading-loose mt-4 text-left ${fontSizeClass}`}
        >
          {verses?.map((v, i) => (
             <span key={`${v.chap}-${v.verse}`} className="mr-1">
               <sup className="text-[10px] text-slate-400 dark:text-slate-500 font-sans font-medium select-none ml-1 mr-0.5">{v.verse}</sup>
               {v.text}
             </span>
          ))}
        </motion.div>
      )}
    </>
  );
}

