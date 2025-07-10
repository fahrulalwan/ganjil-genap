import { Navigation } from 'lucide-react';

const MapLoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-20 h-20">
          {/* Static ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-blue-600/20 dark:border-blue-500/20" />
          {/* Spinning gradient ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent dark:border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(to_top,#2563eb_50%,transparent_0)_border-box] dark:[background:linear-gradient(#030712,#030712)_padding-box,linear-gradient(to_top,#3b82f6_50%,transparent_0)_border-box] animate-spin" />
          {/* Navigation icon */}
          <Navigation className="absolute inset-0 m-auto w-8 h-8 text-blue-600 dark:text-blue-500 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Memuat Peta
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mohon tunggu sebentar...
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapLoadingScreen;
