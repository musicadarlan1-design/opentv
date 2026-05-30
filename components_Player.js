import { useHls } from '../hooks/useHls';
import { useWakeLock } from '../hooks/useWakeLock';
import { AlertCircle, Loader2, Maximize } from 'lucide-react';

export default function Player({ channel }) {
  const { videoRef, error, isLoading } = useHls(channel?.stream);
  useWakeLock(!error && !isLoading);

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
      else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
    }
  };

  if (!channel) return <div className="w-full aspect-video bg-neutral-900 rounded-xl animate-pulse flex items-center justify-center text-neutral-500">Selecione um canal</div>;

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 text-white">
          <Loader2 className="w-10 h-10 animate-spin mb-2" />
          <p className="text-sm font-medium">Carregando {channel.name}...</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 z-10 text-red-500">
          <AlertCircle className="w-12 h-12 mb-2" />
          <p className="font-semibold">Sinal indisponível no momento.</p>
          <p className="text-sm text-neutral-400">Tente novamente mais tarde.</p>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay
        playsInline
        controls
      />

      <button 
        onClick={toggleFullScreen}
        className="absolute bottom-4 right-4 bg-black/50 p-2 rounded hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity md:hidden lg:block"
      >
        <Maximize className="w-5 h-5" />
      </button>
    </div>
  );
}