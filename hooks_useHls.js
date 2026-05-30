import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export function useHls(streamUrl) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let hls;
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    setIsLoading(true);
    setError(false);

    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 30,
        liveSyncDurationCount: 3,
        enableWorker: true,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(() => console.log('Autoplay bloqueado pelo navegador'));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setError(true);
              setIsLoading(false);
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        setError(true);
        setIsLoading(false);
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [streamUrl]);

  return { videoRef, error, isLoading };
}