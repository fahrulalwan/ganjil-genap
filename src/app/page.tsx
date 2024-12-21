import AdSensePlaceholder from '@/components/AdSensePlaceholder';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-950/30 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100">
                  Ganjil Genap
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/about"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Tentang
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Hero Section - Brief Introduction */}
        <div className="relative text-center space-y-8 sm:space-y-10 mb-16 sm:mb-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-4xl sm:text-6xl sm:leading-tight font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Ganjil Genap - Jakarta
            </h1>
            <div className="space-y-4">
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Informasi pembatasan kendaraan bermotor di jalan-jalan utama
                Jakarta berdasarkan nomor plat ganjil-genap
              </p>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-500 max-w-xl mx-auto">
                Cek status pemberlakuan ganjil-genap di lokasi Anda saat ini
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto h-[42px] sm:h-[48px]"
            >
              <Link href="/select">Cek Status Lokasi</Link>
            </Button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="https://github.com/fahrulalwan/ganjil-genap"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <Github className="h-4 w-4" />
                Source code
              </Link>
            </div>
          </div>
        </div>

        {/* Primary Information - Policy Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-24">
          <Card className="bg-card text-card-foreground shadow-sm hover:shadow transition-all overflow-hidden">
            <CardContent className="pt-6 sm:pt-8">
              <div className="flex items-start gap-4">
                <div className="p-2.5 sm:p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
                    Waktu Pemberlakuan
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="p-3 sm:p-4 bg-amber-50/50 dark:bg-amber-950/50 rounded-lg border border-amber-100 dark:border-amber-900">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                          Pagi Hari
                        </p>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-400">
                        06:00 - 10:00
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-blue-50/50 dark:bg-blue-950/50 rounded-lg border border-blue-100 dark:border-blue-900">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                          Sore Hari
                        </p>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400">
                        16:00 - 21:00
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2.5 sm:p-3 rounded-lg">
                      <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      <p>Senin - Jumat (Hari Kerja)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground shadow-sm hover:shadow transition-all overflow-hidden">
            <CardContent className="pt-6 sm:pt-8">
              <div className="flex items-start gap-4">
                <div className="p-2.5 sm:p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
                    Ruas Jalan
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-6 w-1 bg-blue-600 dark:bg-blue-500 rounded-full" />
                        <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                          Jalan Utama Jakarta
                        </p>
                      </div>
                      <ul className="flex flex-col gap-2.5">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Jl. Jend. Sudirman
                          </p>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Jl. M.H. Thamrin
                          </p>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Jl. Gatot Subroto
                          </p>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Jl. H.R. Rasuna Said
                          </p>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Jl. S. Parman
                          </p>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                          <p className="text-gray-600 dark:text-gray-400">
                            Jl. M.T. Haryono
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Information - How to Use */}
        <div className="space-y-12 sm:space-y-16 mb-16 sm:mb-24">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
              Cara Penggunaan
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 bg-card text-card-foreground rounded-xl border border-gray-200 dark:border-gray-800 space-y-3 sm:space-y-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 w-fit rounded-lg">
                <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                1. Izinkan Akses Lokasi
              </h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Aplikasi memerlukan akses lokasi untuk mengetahui posisi Anda
                saat ini
              </p>
            </div>
            <div className="p-6 sm:p-8 bg-card text-card-foreground rounded-xl border border-gray-200 dark:border-gray-800 space-y-3 sm:space-y-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 w-fit rounded-lg">
                <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                2. Lihat Status
              </h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Status akan diperbarui secara otomatis sesuai waktu dan lokasi
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6 sm:space-y-8">
          <Button
            asChild
            size="lg"
            className="bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 dark:text-black shadow-md px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto h-[42px] sm:h-[48px]"
          >
            <Link href="/select">Cek Status Lokasi</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
                  Ganjil Genap Jakarta
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Aplikasi gratis untuk membantu pengguna jalan mengetahui status
                pemberlakuan ganjil genap di Jakarta
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Menu
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/select"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Cek Status
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Tentang
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Informasi
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="https://github.com/fahrulalwan/ganjil-genap"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-1.5"
                    >
                      <Github className="h-4 w-4" />
                      Kode Sumber
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://fahrulalwan.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-1.5"
                    >
                      Portfolio
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} Mohammad Fahrul Alwan. Aplikasi ini
              gratis dan terbuka untuk umum.
            </p>
          </div>
        </div>
      </footer>

      <AdSensePlaceholder className="mt-8" />
    </div>
  );
}
