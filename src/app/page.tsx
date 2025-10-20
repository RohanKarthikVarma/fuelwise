
import { AuthProvider } from '@/context/auth-provider';
import { FuelCalculator } from '@/components/fuel-calculator';
import { TripHistory } from '@/components/trip-history';
import { ThemeToggle } from '@/components/theme-toggle';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold sm:inline-block">
                FuelWise
              </span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <AuthProvider>
            <div className="mx-auto grid w-full max-w-lg gap-12">
              <FuelCalculator />
              <Separator />
              <TripHistory />
            </div>
          </AuthProvider>
        </div>
      </main>
    </div>
  );
}
