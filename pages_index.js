import { useState, useMemo } from 'react';
import Head from 'next/head';
import Player from '../components/Player';
import channelsData from '../data/channels.json';
import { Search, Tv } from 'lucide-react';

const CATEGORIES = ["Todos", "Notícias", "Música", "Infantil", "Esportes", "Religiosos", "Brasil", "Internacionais", "Documentários"];

export default function Home() {
  const [currentChannel, setCurrentChannel] = useState(channelsData[0]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChannels = useMemo(() => {
    return channelsData.filter(channel => {
      const matchCategory = activeCategory === "Todos" || channel.category === activeCategory;
      const matchSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-blue-600">
      <Head>
        <title>OpenTV - Streaming Legal e Gratuito</title>
        <meta name="description" content="Assista TV aberta gratuitamente de forma legalizada." />
      </Head>

      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:flex lg:gap-8">
        <section className="lg:w-2/3 flex flex-col gap-4 sticky top-0 bg-neutral-950/90 z-20 pt-2 lg:pt-0 backdrop-blur-md pb-4 lg:pb-0">
          <div className="flex items-center gap-2 mb-2">
            <Tv className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold tracking-tight">OpenTV</h1>
          </div>
          <Player channel={currentChannel} />
          {currentChannel && (
            <div>
              <h2 className="text-xl font-bold">{currentChannel.name}</h2>
              <span className="inline-block bg-neutral-800 text-xs px-2 py-1 rounded-md text-neutral-400 mt-1">{currentChannel.category}</span>
            </div>
          )}
        </section>

        <section className="lg:w-1/3 mt-6 lg:mt-0 flex flex-col h-[calc(100vh-2rem)]">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Buscar canal..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 pb-20 lg:pb-0">
            {filteredChannels.map(channel => (
              <button
                key={channel.name}
                onClick={() => {
                  setCurrentChannel(channel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  currentChannel?.name === channel.name 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-neutral-800 bg-neutral-900 hover:border-neutral-600'
                }`}
              >
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-3 text-lg font-bold">
                  {channel.logo ? <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain p-2" loading="lazy" /> : channel.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-center truncate w-full">{channel.name}</span>
              </button>
            ))}
            {filteredChannels.length === 0 && (
              <div className="col-span-full text-center text-neutral-500 py-10">Nenhum canal encontrado.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}