import AdSensePlaceholder from '@/components/AdSensePlaceholder';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Github } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Ganjil Genap
          </CardTitle>
          <CardDescription className="text-center">
            Navigasi sistem pembatasan lalu lintas Jakarta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Tentang Project</h2>
            <p className="text-muted-foreground">
              Ganjil Genap membantu pengguna menavigasi sistem pembatasan lalu
              lintas Jakarta berdasarkan nomor plat kendaraan dan lokasi saat
              ini.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Author</h2>
            <p className="text-muted-foreground">Mohammad Fahrul Alwan</p>
            <Link
              href="https://fahrulalwan.vercel.app"
              className="text-primary hover:underline"
            >
              Portfolio
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Button asChild>
            <Link href="/select">Mulai</Link>
          </Button>
          <a
            href="https://github.com/fahrulalwan/ganjil-genap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <Github className="w-5 h-5 mr-2" />
            Lihat di GitHub
          </a>
        </CardFooter>
      </Card>
      <AdSensePlaceholder className="mt-8" />
    </div>
  );
}
