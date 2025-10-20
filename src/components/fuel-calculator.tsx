
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { indianStates, mockFuelPrices } from '@/lib/data';
import { Loader2 } from 'lucide-react';

// Schemas
const tripSchema = z.object({
  distance: z.coerce.number().min(0.1, 'Distance must be > 0'),
  efficiency: z.coerce.number().min(0.1, 'Efficiency must be > 0'),
  state: z.string().min(1, 'Please select a state'),
  fuelPrice: z.coerce.number().min(1, 'Fuel price must be > 0'),
});

const dailySchema = z.object({
  distance: z.coerce.number().min(0.1, 'Round trip distance must be > 0'),
  efficiency: z.coerce.number().min(0.1, 'Efficiency must be > 0'),
  state: z.string().min(1, 'Please select a state'),
  fuelPrice: z.coerce.number().min(1, 'Fuel price must be > 0'),
});

const monthlySchema = z.object({
  dailyCost: z.coerce.number().min(0.1, 'Daily cost must be > 0'),
  commuteDays: z.coerce.number().int().min(1).max(31, 'Days must be between 1-31'),
});


// Form Value Types
type TripFormValues = z.infer<typeof tripSchema>;
type DailyFormValues = z.infer<typeof dailySchema>;
type MonthlyFormValues = z.infer<typeof monthlySchema>;

// Result Type
type CalculationResult = {
  title: string;
  items: { label: string; value: string }[];
};

const ResultDisplay = ({ result }: { result: CalculationResult | null }) => {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full rounded-lg border bg-muted/50 p-4"
    >
      <h3 className="text-center text-lg font-semibold text-primary">{result.title}</h3>
      <div className="mt-2 divide-y divide-border">
        {result.items.map((item, index) => (
          <div key={index} className="flex justify-between py-2">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};


export function FuelCalculator() {
  const [activeTab, setActiveTab] = React.useState('trip');
  const [result, setResult] = React.useState<CalculationResult | null>(null);
  
  const tripForm = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: { distance: undefined, efficiency: undefined, state: '', fuelPrice: undefined },
  });

  const dailyForm = useForm<DailyFormValues>({
    resolver: zodResolver(dailySchema),
    defaultValues: { distance: undefined, efficiency: undefined, state: '', fuelPrice: undefined },
  });

  const monthlyForm = useForm<MonthlyFormValues>({
    resolver: zodResolver(monthlySchema),
    defaultValues: { dailyCost: undefined, commuteDays: 22 },
  });

  const useAutoFuelPrice = (form: typeof tripForm | typeof dailyForm) => {
    const selectedState = form.watch('state');
    React.useEffect(() => {
      if (selectedState) {
        const price = mockFuelPrices[selectedState] || mockFuelPrices.default;
        form.setValue('fuelPrice', price, { shouldValidate: true });
      }
    }, [selectedState, form]);
  };
  
  useAutoFuelPrice(tripForm);
  useAutoFuelPrice(dailyForm);

  const onSubmit = async (values: any) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (activeTab === 'trip') {
      const { distance, efficiency, fuelPrice } = values as TripFormValues;
      const totalFuel = distance / efficiency;
      const totalCost = totalFuel * fuelPrice;
      setResult({
        title: 'Single Trip Estimate',
        items: [
          { label: 'Total Fuel Needed', value: `${totalFuel.toFixed(2)} liters` },
          { label: 'Estimated Trip Cost', value: `₹${totalCost.toFixed(2)}` },
        ],
      });
    } else if (activeTab === 'daily') {
      const { distance, efficiency, fuelPrice } = values as DailyFormValues;
      const totalFuel = distance / efficiency;
      const totalCost = totalFuel * fuelPrice;
      setResult({
        title: 'Daily Commute Estimate',
        items: [
          { label: 'Fuel per Day', value: `${totalFuel.toFixed(2)} liters` },
          { label: 'Estimated Daily Cost', value: `₹${totalCost.toFixed(2)}` },
        ],
      });
      monthlyForm.setValue('dailyCost', parseFloat(totalCost.toFixed(2)));
    } else if (activeTab === 'monthly') {
        const { dailyCost, commuteDays } = values as MonthlyFormValues;
        const totalCost = dailyCost * commuteDays;
        setResult({
            title: 'Monthly Expense Estimate',
            items: [
                { label: 'Estimated Monthly Cost', value: `₹${totalCost.toFixed(2)}` },
                { label: 'Based on', value: `${commuteDays} commute days` },
            ],
        });
    }
  };

  const currentForm = {
    'trip': tripForm,
    'daily': dailyForm,
    'monthly': monthlyForm,
  }[activeTab];
  
  const { formState: { isSubmitting } } = currentForm || {};

  return (
    <Tabs defaultValue="trip" className="w-full" onValueChange={id => { setActiveTab(id); setResult(null); }}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="trip">Single Trip</TabsTrigger>
        <TabsTrigger value="daily">Daily Commute</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>

      <AnimatePresenceWrapper>
        <TabsContent value="trip">
          <Form {...tripForm}>
            <form onSubmit={tripForm.handleSubmit(onSubmit)}>
              <CalculatorCard>
                <CardContent className="space-y-4">
                  <FormField control={tripForm.control} name="distance" render={({ field }) => <FormItem><FormLabel>Trip Distance (km)</FormLabel><FormControl><Input type="number" placeholder="e.g., 350" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={tripForm.control} name="efficiency" render={({ field }) => <FormItem><FormLabel>Vehicle's Fuel Efficiency (km/l)</FormLabel><FormControl><Input type="number" placeholder="e.g., 18" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <LocationFields form={tripForm} />
                </CardContent>
                <CalculationFooter isSubmitting={isSubmitting} result={result} buttonText="Calculate Trip Cost" />
              </CalculatorCard>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="daily">
          <Form {...dailyForm}>
            <form onSubmit={dailyForm.handleSubmit(onSubmit)}>
              <CalculatorCard>
                  <CardContent className="space-y-4">
                      <FormField control={dailyForm.control} name="distance" render={({ field }) => <FormItem><FormLabel>Daily Round Trip (km)</FormLabel><FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl><FormMessage /></FormItem>} />
                      <FormField control={dailyForm.control} name="efficiency" render={({ field }) => <FormItem><FormLabel>Vehicle's Fuel Efficiency (km/l)</FormLabel><FormControl><Input type="number" placeholder="e.g., 18" {...field} /></FormControl><FormMessage /></FormItem>} />
                      <LocationFields form={dailyForm} />
                  </CardContent>
                  <CalculationFooter isSubmitting={isSubmitting} result={result} buttonText="Calculate Daily Cost" />
              </CalculatorCard>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="monthly">
            <Form {...monthlyForm}>
                <form onSubmit={monthlyForm.handleSubmit(onSubmit)}>
                    <CalculatorCard>
                        <CardContent className="space-y-4">
                             <FormField control={monthlyForm.control} name="dailyCost" render={({ field }) => <FormItem><FormLabel>Cost per Day (₹)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="Calculated from 'Daily'" {...field} /></FormControl><FormMessage /></FormItem>} />
                             <FormField control={monthlyForm.control} name="commuteDays" render={({ field }) => <FormItem><FormLabel>Commute Days per Month</FormLabel><FormControl><Input type="number" placeholder="e.g., 22" {...field} /></FormControl><FormMessage /></FormItem>} />
                        </CardContent>
                        <CalculationFooter isSubmitting={isSubmitting} result={result} buttonText="Calculate Monthly Cost" />
                    </CalculatorCard>
                </form>
            </Form>
        </TabsContent>
      </AnimatePresenceWrapper>
    </Tabs>
  );
}

const AnimatePresenceWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className="mt-4"
  >
    {children}
  </motion.div>
);

const CalculatorCard = ({ children }: { children: React.ReactNode }) => (
    <Card className="w-full shadow-lg">
        <CardHeader>
            <CardTitle>Fuel Cost Estimator</CardTitle>
            <CardDescription>Select a tab to calculate for a trip, day, or month.</CardDescription>
        </CardHeader>
        {children}
    </Card>
);

const LocationFields = ({ form }: { form: any }) => (
    <>
        <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select an Indian state" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {indianStates.map((state) => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="fuelPrice"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Fuel Price (₹ per liter)</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="Auto-filled from state" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    </>
);

const CalculationFooter = ({ isSubmitting, result, buttonText }: { isSubmitting: boolean; result: CalculationResult | null; buttonText: string }) => (
    <CardFooter className="flex flex-col items-stretch gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Calculating...</> : buttonText}
        </Button>
        <ResultDisplay result={result} />
    </CardFooter>
);
