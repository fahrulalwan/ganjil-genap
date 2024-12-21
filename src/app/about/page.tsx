import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Github, Mail, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Beranda
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="space-y-16">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl leading-tight font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Tentang Ganjil Genap
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Alat bantu untuk memantau pemberlakuan sistem ganjil genap di
              Jakarta. Membantu Anda mengetahui status pemberlakuan berdasarkan
              lokasi dan plat nomor kendaraan.
            </p>
            <div className="inline-flex items-center gap-6 pt-4 px-6 py-3 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Gratis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Tanpa Registrasi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Real-time</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Key Features First */}
            <Card className="bg-card text-card-foreground shadow-sm hover:shadow transition-all overflow-hidden border-gray-200 dark:border-gray-800">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 sm:p-3 bg-blue-100 dark:bg-blue-950 rounded-lg">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Fungsi
                  </h2>
                </div>
                <div className="space-y-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                        1
                      </span>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Deteksi lokasi untuk mengetahui status ganjil-genap di
                          area Anda
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                        2
                      </span>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Tampilan peta area pemberlakuan ganjil-genap
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                        3
                      </span>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Informasi jadwal dan area pemberlakuan
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-sm font-medium text-blue-600 dark:text-blue-400">
                        4
                      </span>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Dapat diakses dari berbagai perangkat
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <Card className="bg-card text-card-foreground shadow-sm hover:shadow transition-all overflow-hidden border-gray-200 dark:border-gray-800">
                <CardContent className="p-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    Tentang Aplikasi
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                        Latar Belakang
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Aplikasi ini dibuat untuk membantu pengemudi di Jakarta
                        dalam menghadapi pemberlakuan sistem ganjil-genap.
                        Sistem ini diterapkan di beberapa ruas jalan utama
                        Jakarta pada jam-jam tertentu.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                        Tujuan
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Memberikan informasi yang akurat tentang pemberlakuan
                        aturan ganjil-genap untuk membantu pengemudi
                        merencanakan rute perjalanan dengan lebih baik.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card text-card-foreground shadow-sm hover:shadow transition-all overflow-hidden border-gray-200 dark:border-gray-800">
                <CardContent className="p-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    Informasi Penting
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50/50 dark:bg-amber-950/50 rounded-lg border border-amber-100 dark:border-amber-900">
                      <h3 className="font-medium mb-2 text-amber-700 dark:text-amber-400">
                        Perhatian
                      </h3>
                      <p className="text-sm text-amber-700/90 dark:text-amber-400/90 leading-relaxed">
                        Aplikasi ini hanya bersifat informatif. Pengguna tetap
                        harus memperhatikan rambu-rambu dan peraturan lalu
                        lintas yang berlaku di lapangan.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50/50 dark:bg-blue-950/50 rounded-lg border border-blue-100 dark:border-blue-900">
                      <h3 className="font-medium mb-2 text-blue-700 dark:text-blue-400">
                        Penggunaan Data
                      </h3>
                      <ul className="space-y-2 text-sm text-blue-700/90 dark:text-blue-400/90">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-50 dark:bg-blue-950" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Data lokasi hanya diproses di perangkat
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-50 dark:bg-blue-950" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Tidak ada penyimpanan data pribadi
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-50 dark:bg-blue-950" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Tidak memerlukan registrasi
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Technology section */}
            <Card className="bg-card text-card-foreground shadow-sm hover:shadow transition-all overflow-hidden border-gray-200 dark:border-gray-800">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Teknologi</h2>
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
                    <div className="font-medium">Next.js 15</div>
                    <div className="text-xs text-muted-foreground">
                      Framework
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
                    <div className="font-medium">React</div>
                    <div className="text-xs text-muted-foreground">
                      UI Library
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
                    <div className="font-medium">TypeScript</div>
                    <div className="text-xs text-muted-foreground">
                      Language
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
                    <div className="font-medium">Tailwind CSS</div>
                    <div className="text-xs text-muted-foreground">Styling</div>
                  </div>
                  <div className="px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
                    <div className="font-medium">shadcn/ui</div>
                    <div className="text-xs text-muted-foreground">
                      Components
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Developer and Contact */}
            <Card className="bg-card text-card-foreground shadow-sm hover:shadow transition-all overflow-hidden border-gray-200 dark:border-gray-800">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Developer & Kontak</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xl font-medium">
                          Mohammad Fahrul Alwan
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Software Engineer
                        </p>
                      </div>
                      <p className="text-muted-foreground">
                        Proyek ini dibuat sebagai inisiatif pribadi untuk
                        membantu masyarakat Jakarta.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href="https://github.com/fahrulalwan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-background/80 hover:bg-background rounded-full text-sm font-medium transition-colors border border-border/50"
                      >
                        <Github className="h-4 w-4 mr-1.5" />
                        GitHub
                      </Link>
                      <Link
                        href="https://linkedin.com/in/fahrulalwan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-background/80 hover:bg-background rounded-full text-sm font-medium transition-colors border border-border/50"
                      >
                        <Linkedin className="h-4 w-4 mr-1.5" />
                        LinkedIn
                      </Link>
                      <Link
                        href="https://fahrulalwan.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-background/80 hover:bg-background rounded-full text-sm font-medium transition-colors border border-border/50"
                      >
                        Website
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
                      <h3 className="font-medium mb-2">Kontribusi</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Proyek ini bersifat open source. Anda dapat
                        berkontribusi melalui GitHub repository.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="mailto:fahrulalwan@gmail.com"
                          className="inline-flex items-center px-3 py-1.5 bg-card hover:bg-card/80 border border-border/50 rounded-full text-sm font-medium justify-center transition-colors"
                        >
                          <Mail className="h-4 w-4 mr-1.5" />
                          Email
                        </Link>
                        <Link
                          href="https://github.com/fahrulalwan/ganjil-genap/issues"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-card hover:bg-card/80 border border-border/50 rounded-full text-sm font-medium justify-center transition-colors"
                        >
                          <Github className="h-4 w-4 mr-1.5" />
                          Lapor Bug
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4 max-w-sm mx-auto">
            <div className="p-6 bg-card text-card-foreground rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow transition-all">
              <Button
                asChild
                size="lg"
                className="bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 dark:text-black shadow-md px-6 sm:px-8 text-base sm:text-lg w-full h-[42px] sm:h-[48px]"
              >
                <Link href="/select">Mulai Menggunakan</Link>
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                Gratis dan tanpa perlu registrasi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} Mohammad Fahrul Alwan. Aplikasi ini
              gratis dan terbuka untuk umum.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
