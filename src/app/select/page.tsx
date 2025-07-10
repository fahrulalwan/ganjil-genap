import SelectAreaCoverageCard from '@/components/app/select/select-area-coverage-card';
import SelectTimeRestrictionCard from '@/components/app/select/select-time-restriction-card';
import SelectVehicleLicenseForm from '@/components/app/select/select-vehicle-license-form';

export default function VehicleSelectionPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-950/30 dark:to-gray-900">
      <div className="w-full max-w-4xl space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl leading-tight font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Ganjil Genap
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Navigasi sistem pembatasan lalu lintas Jakarta dengan mudah dan
            tepat waktu
          </p>
        </header>

        <SelectVehicleLicenseForm />

        <section className="space-y-6">
          <div className="relative flex items-center gap-3">
            <div
              className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"
              aria-hidden="true"
            />
            <h2 className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/20 dark:border-blue-500/10 text-sm font-medium text-muted-foreground">
              Informasi Kebijakan
            </h2>
            <div
              className="h-px flex-1 bg-gradient-to-r from-border to-transparent"
              aria-hidden="true"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <SelectTimeRestrictionCard />
            <SelectAreaCoverageCard />
          </div>
        </section>
      </div>
    </div>
  );
}
