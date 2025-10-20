
import { AuthProvider } from '@/context/auth-provider';
import { FuelCalculator } from '@/components/fuel-calculator';
import { ThemeToggle } from '@/components/theme-toggle';
import { Leaf } from 'lucide-react';
import { TripHistory } from '@/components/trip-history';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center">
            <div className="mr-4 hidden md:flex">
              <a className="mr-6 flex items-center space-x-2" href="/">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="hidden font-bold sm:inline-block">
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
          <div className="container relative py-8 md:py-12">
              <div className="mx-auto grid w-full max-w-3xl justify-center gap-12">
                <div className="flex flex-col items-center gap-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
                      Smart Fuel Cost Planning
                    </h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">
                      Instantly estimate your fuel expenses for single trips, daily commutes, or monthly budgets with real-time price simulations.
                    </p>
                </div>
                <FuelCalculator />
                <Separator />
                <TripHistory />
              </div>
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
