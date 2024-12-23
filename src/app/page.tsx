import AdSensePlaceholder from '@/components/AdSensePlaceholder';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <article className="bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-950/30 dark:to-gray-900">
      {/* Navigation */}
      <nav
        className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50"
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-14 sm:h-16">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Ganjil Genap - Beranda"
          >
            <MapPin
              className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400"
              aria-hidden="true"
            />
            <span className="font-bold text-lg sm:text-xl text-gray-900 dark:text-gray-100">
              Ganjil Genap
            </span>
          </Link>
          <Link
            href="/about"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center"
            aria-label="Tentang Aplikasi"
          >
            Tentang
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Hero Section */}
        <section
          className="relative text-center space-y-8 sm:space-y-10 mb-16 sm:mb-24"
          aria-labelledby="hero-title"
        >
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
            aria-hidden="true"
          />
          <h1
            id="hero-title"
            className="text-4xl sm:text-6xl sm:leading-tight font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
          >
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
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4"
            aria-label="Aksi Utama"
          >
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto h-[42px] sm:h-[48px]"
            >
              <Link href="/select">Cek Status Lokasi</Link>
            </Button>
            <Link
              href="https://github.com/fahrulalwan/ganjil-genap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 dark:text-gray-400 inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Lihat kode sumber di GitHub (membuka di tab baru)"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              Source code
            </Link>
          </div>
        </section>

        {/* Policy Details */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-24"
          aria-labelledby="policy-details"
        >
          <h2 id="policy-details" className="sr-only">
            Informasi Kebijakan
          </h2>
          <Card className="bg-card text-card-foreground shadow-sm hover:shadow transition-all overflow-hidden">
            <CardContent className="pt-6 sm:pt-8">
              <div className="flex items-start gap-4">
                <span
                  className="p-2.5 sm:p-3 bg-blue-100 dark:bg-blue-950 rounded-lg"
                  aria-hidden="true"
                >
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </span>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
                    Waktu Pemberlakuan
                  </h3>
                  <div
                    className="space-y-3 sm:space-y-4"
                    aria-label="Jadwal Pemberlakuan"
                  >
                    <time
                      dateTime="06:00-10:00"
                      className="block p-3 sm:p-4 bg-amber-50/50 dark:bg-amber-950/50 rounded-lg border border-amber-100 dark:border-amber-900"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-2 h-2 rounded-full bg-amber-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                          Pagi Hari
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-400">
                        06:00 - 10:00
                      </span>
                    </time>
                    <time
                      dateTime="16:00-21:00"
                      className="block p-3 sm:p-4 bg-blue-50/50 dark:bg-blue-950/50 rounded-lg border border-blue-100 dark:border-blue-900"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-2 h-2 rounded-full bg-blue-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                          Sore Hari
                        </span>
                      </div>
                      <span className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400">
                        16:00 - 21:00
                      </span>
                    </time>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2.5 sm:p-3 rounded-lg">
                      <Clock
                        className="h-4 w-4 text-gray-400 dark:text-gray-500"
                        aria-hidden="true"
                      />
                      <span>Senin - Jumat (Hari Kerja)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card text-card-foreground shadow-sm hover:shadow transition-all overflow-hidden">
            <CardContent className="pt-6 sm:pt-8">
              <div className="flex items-start gap-4">
                <span
                  className="p-2.5 sm:p-3 bg-blue-100 dark:bg-blue-950 rounded-lg"
                  aria-hidden="true"
                >
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </span>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
                    Ruas Jalan
                  </h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="h-6 w-1 bg-blue-600 dark:bg-blue-500 rounded-full"
                        aria-hidden="true"
                      />
                      <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                        Jalan Utama Jakarta
                      </span>
                    </div>
                    <ul
                      className="flex flex-col gap-2.5"
                      aria-label="Daftar Jalan yang Berlaku Ganjil Genap"
                    >
                      {[
                        'Jl. Jend. Sudirman',
                        'Jl. M.H. Thamrin',
                        'Jl. Gatot Subroto',
                        'Jl. H.R. Rasuna Said',
                        'Jl. S. Parman',
                        'Jl. M.T. Haryono',
                      ].map((road) => (
                        <li key={road} className="flex items-center gap-2">
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500"
                            aria-hidden="true"
                          />
                          <span className="text-gray-600 dark:text-gray-400">
                            {road}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How to Use */}
        <section
          className="space-y-12 sm:space-y-16 mb-16 sm:mb-24"
          aria-labelledby="how-to-use"
        >
          <h2
            id="how-to-use"
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center"
          >
            Cara Penggunaan
          </h2>

          <div
            className="grid md:grid-cols-2 gap-6 sm:gap-8"
            aria-label="Langkah-langkah Penggunaan"
          >
            {[
              {
                icon: (
                  <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600 dark:text-gray-400" />
                ),
                title: '1. Izinkan Akses Lokasi',
                description:
                  'Aplikasi memerlukan akses lokasi untuk mengetahui posisi Anda saat ini',
              },
              {
                icon: (
                  <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-gray-600 dark:text-gray-400" />
                ),
                title: '2. Lihat Status',
                description:
                  'Status akan diperbarui secara otomatis sesuai waktu dan lokasi',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 sm:p-8 bg-card text-card-foreground rounded-xl border border-gray-200 dark:border-gray-800 space-y-3 sm:space-y-4"
              >
                <span
                  className="p-3 bg-gray-100 dark:bg-gray-800 w-fit rounded-lg block"
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center" aria-labelledby="cta-title">
          <h2 id="cta-title" className="sr-only">
            Mulai Menggunakan Aplikasi
          </h2>
          <Button
            asChild
            size="lg"
            className="bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 dark:text-black shadow-md px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto h-[42px] sm:h-[48px]"
          >
            <Link href="/select">Cek Status Lokasi</Link>
          </Button>
        </section>
      </div>

      {/* Footer */}
      <footer
        className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm mt-16"
        aria-label="Footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin
                  className="h-6 w-6 text-gray-600 dark:text-gray-400"
                  aria-hidden="true"
                />
                <span className="font-bold text-xl text-gray-900 dark:text-gray-100">
                  Ganjil Genap Jakarta
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Aplikasi gratis untuk membantu pengguna jalan mengetahui status
                pemberlakuan ganjil genap di Jakarta
              </p>
            </div>
            <nav
              className="grid grid-cols-2 gap-8"
              aria-label="Footer Navigation"
            >
              {[
                {
                  title: 'Menu',
                  links: [
                    { href: '/select', label: 'Cek Status', external: false },
                    { href: '/about', label: 'Tentang', external: false },
                  ] as const,
                },
                {
                  title: 'Informasi',
                  links: [
                    {
                      href: 'https://github.com/fahrulalwan/ganjil-genap',
                      label: 'Kode Sumber',
                      icon: <Github className="h-4 w-4" />,
                      external: true,
                    },
                    {
                      href: 'https://fahrulalwan.vercel.app',
                      label: 'Portfolio',
                      external: true,
                    },
                  ] as const,
                },
              ].map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={
                            link.external ? 'noopener noreferrer' : undefined
                          }
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center gap-1.5"
                          aria-label={`${link.label}${link.external ? ' (membuka di tab baru)' : ''}`}
                        >
                          {'icon' in link && (
                            <span aria-hidden="true">{link.icon}</span>
                          )}
                          {link.label}
                          {link.external && (
                            <ExternalLink
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>
              © {new Date().getFullYear()} Mohammad Fahrul Alwan. Aplikasi ini
              gratis dan terbuka untuk umum.
            </p>
          </div>
        </div>
      </footer>

      <aside aria-label="Advertisement">
        <AdSensePlaceholder className="mt-8" />
      </aside>
    </article>
  );
}
