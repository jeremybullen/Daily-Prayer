import { useState, useEffect } from 'react';
import { getDayOfYear } from './utils';
import { lectionaryData } from './data/lectionaryData';
import { Sun, Moon } from 'lucide-react';
import { BibleReading } from './components/BibleReading';
import { motion, AnimatePresence } from 'motion/react';
import { CustomCalendar } from './components/CustomCalendar';

export default function App() {
  const [view, setView] = useState<'morning' | 'evening'>('morning');
  const [date, setDate] = useState(new Date());
  const [isScriptureLoading, setIsScriptureLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Automatically set view based on user's current local time
    const hour = date.getHours();
    if (hour >= 16) {
      setView('evening');
    } else {
      setView('morning');
    }
  }, [date]);

  const dayOfYear = getDayOfYear(date);
  // Safely find the current day's data, default to day 1 if not found for some reason
  const readingData = lectionaryData.find(d => d.day === dayOfYear) || lectionaryData[0];

  const isMorning = view === 'morning';
  
  // LOGIC SWAP CRITICAL REQUIREMENT:
  // For the Morning View, display the text from the `evening` key (New Testament).
  // For the Evening View, display the text from the `morning` key (Wisdom/Psalms).
  const scriptureReference = isMorning ? readingData.evening : readingData.morning;
  
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString(undefined, options);

  return (
    <div className="min-h-screen bg-[#F2F2EB] dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-200 relative overflow-x-hidden transition-colors duration-300">
      {/* Mesh Background Decorative Elements */}
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-100 dark:bg-blue-900/40 rounded-full blur-[120px] opacity-40 pointer-events-none animate-blob"></div>
      <div className="fixed bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-orange-100 dark:bg-orange-900/40 rounded-full blur-[120px] opacity-30 pointer-events-none animate-blob-reverse"></div>

      {/* App Container */}
      <div className="relative z-10 flex flex-col h-full p-4 md:p-8 max-w-6xl mx-auto w-full flex-grow">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4 md:gap-0"
        >
          <div className="relative">
            <button 
              onClick={() => setIsCalendarOpen(true)}
              className="text-left group inline-block focus:outline-none"
            >
              <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-slate-100 border-b-[2px] border-dashed border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-400 transition-colors pb-1 md:pb-2">
                {formattedDate}
              </h2>
            </button>
            <AnimatePresence>
              {isCalendarOpen && (
                <div className="absolute top-full left-0 mt-4 z-50">
                  <CustomCalendar 
                    currentDate={date} 
                    onSelectDate={setDate} 
                    onClose={() => setIsCalendarOpen(false)} 
                  />
                </div>
              )}
            </AnimatePresence>
            <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 font-semibold mt-2 md:mt-4">Day {dayOfYear}</p>
          </div>
          <div className="md:text-right flex flex-col md:items-end">
            <div className="flex items-center gap-4 mb-1 md:mb-1 justify-start md:justify-end">
              <a href="https://www.laneschapel.org" target="_blank" rel="noopener noreferrer" className="text-[10px] md:text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-amber-300 tracking-[0.2em] uppercase transition-colors">Lane's Chapel</a>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-amber-300 transition-colors shadow-sm focus:outline-none"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={12} /> : <Moon size={12} />}
              </button>
            </div>
            <h1 className="text-xl md:text-2xl font-serif italic text-slate-800 dark:text-slate-200">Daily Prayer</h1>
          </div>
        </motion.header>

        {/* View Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center mb-10"
        >
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-1.5 rounded-full border border-white/50 dark:border-slate-700/50 shadow-sm flex inline-flex relative">
            <button 
              onClick={() => setView('morning')}
              className={`relative z-10 px-8 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${isMorning ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              Morning
            </button>
            <button 
              onClick={() => setView('evening')}
              className={`relative z-10 px-8 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${!isMorning ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              Evening
            </button>
            {/* Animated Indicator */}
            <div 
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white dark:bg-slate-800 rounded-full shadow-sm transition-all duration-300 ease-out"
              style={{
                left: isMorning ? "0.375rem" : "calc(50% + 0.1875rem)"
              }}
            />
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow mb-6 items-start">
          
          {/* Left Column: Reflect & Pray */}
          <div className="flex flex-col gap-8">
            {/* Reflect Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 border border-white/60 dark:border-slate-700/50 shadow-xl flex flex-col relative overflow-hidden h-fit"
            >
              {/* Subtle decor line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 dark:via-teal-700/30 to-transparent opacity-50"></div>
              
              <div className="mb-4 md:mb-6 shrink-0 text-left">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-semibold">Reflect</span>
                <h3 className="text-3xl md:text-4xl font-serif text-slate-800 dark:text-slate-100 mt-2">
                  <motion.span
                    key={isMorning ? "morning-reflect" : "evening-reflect"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    {isMorning ? "The Apostles' Creed" : "The Ten Commandments"}
                  </motion.span>
                </h3>
              </div>
              
              <div className="flex-grow overflow-y-auto px-2 md:px-0 custom-scrollbar text-left">
                <div className="font-serif text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300 my-2 md:my-4 flex flex-col space-y-4 md:space-y-6">
                  <motion.div
                    key={isMorning ? "morning" : "evening"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 md:space-y-6"
                  >
                    {isMorning ? (
                      <>
                        <p>
                          I believe in God, the Father Almighty,<br />
                          maker of heaven and earth;
                        </p>
                        <p>
                          And in Jesus Christ his only Son, our Lord;<br />
                          who was conceived by the Holy Spirit,<br />
                          born of the Virgin Mary,<br />
                          suffered under Pontius Pilate,<br />
                          was crucified, dead, and buried;<br />
                          the third day he rose from the dead;<br />
                          he ascended into heaven,<br />
                          and sitteth at the right hand of God the Father Almighty;<br />
                          from thence he shall come to judge the quick and the dead.
                        </p>
                        <p>
                          I believe in the Holy Spirit,<br />
                          the holy catholic church,<br />
                          the communion of saints,<br />
                          the forgiveness of sins,<br />
                          the resurrection of the body,<br />
                          and the life everlasting. Amen.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">I am the Lord your God, who brought you out of the land of Egypt, out of the house of slavery.</p>
                        <div className="space-y-3">
                          <p>1. You shall have no other gods before me.</p>
                          <p>2. You shall not make for yourself a carved image, or any likeness of anything that is in heaven above, or that is in the earth beneath, or that is in the water under the earth. You shall not bow down to them or serve them.</p>
                          <p>3. You shall not take the name of the Lord your God in vain, for the Lord will not hold him guiltless who takes his name in vain.</p>
                          <p>4. Remember the Sabbath day, to keep it holy. Six days you shall labor, and do all your work, but the seventh day is a Sabbath to the Lord your God.</p>
                          <p>5. Honor your father and your mother, that your days may be long in the land that the Lord your God is giving you.</p>
                          <p>6. You shall not murder.</p>
                          <p>7. You shall not commit adultery.</p>
                          <p>8. You shall not steal.</p>
                          <p>9. You shall not bear false witness against your neighbor.</p>
                          <p>10. You shall not covet your neighbor's house; you shall not covet your neighbor's wife, or his male servant, or his female servant, or his ox, or his donkey, or anything that is your neighbor's.</p>
                        </div>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.section>

            {/* Liturgy Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-6 md:p-10 border border-white/60 dark:border-slate-700/50 shadow-xl flex flex-col relative overflow-hidden h-fit"
            >
              {/* Subtle decor line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-200 dark:via-amber-700/30 to-transparent opacity-50"></div>
              
              <div className="mb-4 md:mb-6 shrink-0 text-left">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-semibold">Pray</span>
                <h3 className="text-3xl md:text-4xl font-serif text-slate-800 dark:text-slate-100 mt-2">
                  <motion.span
                    key={isMorning ? "morning-title" : "evening-title"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    {isMorning ? "The Lord's Prayer" : "The Confession of Sin"}
                  </motion.span>
                </h3>
              </div>
              
              <div className="flex-grow overflow-y-auto px-2 md:px-0 custom-scrollbar text-left">
                <div className="font-serif text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300 my-2 md:my-4 flex flex-col space-y-4 md:space-y-6">
                  <motion.div
                    key={isMorning ? "morning" : "evening"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 md:space-y-6"
                  >
                    {isMorning ? (
                      <>
                        <p>
                           Our Father, who art in heaven, hallowed be thy Name, thy kingdom come, thy will be done, on earth as it is in heaven.
                        </p>
                        <p>
                           Give us this day our daily bread. And forgive us our trespasses, as we forgive those who trespass against us.
                        </p>
                        <p>
                           And lead us not into temptation; but deliver us from evil. For thine is the kingdom, the power and the glory, for ever and ever. Amen.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Almighty and most merciful God, We have erred, and strayed from thy ways like lost sheep.
                        </p>
                        <p>
                          We have followed too much the devices and desires of our own hearts. We have offended against thy holy laws.
                        </p>
                        <p>
                          We have left undone those things which we ought to have done; And we have done those things which we ought not to have done.
                        </p>
                        <p>
                          But thou, O Lord, have mercy upon us. Spare thou those, O God, who confess their faults.
                        </p>
                        <p>
                          Restore thou those that are penitent, according to thy promises declared unto mankind in Christ Jesus our Lord.
                        </p>
                        <p>
                          And grant, O most merciful God, for his sake; That we may hereafter live a godly, righteous and sober life. To the Glory of thy holy Name. Amen.
                        </p>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Scripture Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white/60 dark:border-slate-700/50 shadow-xl flex flex-col overflow-hidden relative"
          >
            {/* Subtle decor line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-900/30 to-transparent opacity-50"></div>
            
            <div className="mb-6 flex justify-between items-start shrink-0">
              <div className="text-left w-full">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-semibold block">Read</span>
                <motion.h3 
                  key={scriptureReference}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl md:text-4xl font-serif text-slate-800 dark:text-slate-100 mt-2"
                >
                  {scriptureReference}
                </motion.h3>
              </div>
              {isScriptureLoading && (
                <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 border-t-slate-800 dark:border-t-slate-200 rounded-full animate-spin flex-shrink-0 ml-4 mt-2"></div>
              )}
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              <BibleReading 
                reference={scriptureReference} 
                onLoadingChange={setIsScriptureLoading} 
              />
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-start shrink-0">
              <span className="text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-slate-500 uppercase">English Standard Version</span>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
