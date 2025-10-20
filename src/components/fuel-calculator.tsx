
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { useToast } from '@/hooks/use-toast';
import { indianStates, mockFuelPrices } from '@/lib/data';
import { useAuth } from '@/context/auth-provider';
import { addTrip } from '@/app/actions';
import { Loader2 } from 'lucide-react';

const tripSchema = z.object({
  distance: z.coerce.number().min(0.1, 'Distance must be greater than 0'),
  efficiency: z.coerce.number().min(0.1, 'Efficiency must be greater than 0'),
  state: z.string().min(1, 'Please select a state'),
  fuelPrice: z.coerce.number().min(1, 'Fuel price must be greater than 0'),
});

type TripFormValues = z.infer<typeof tripSchema>;

type CalculationResult = {
  totalFuel: number;
  totalCost: number;
};

export function FuelCalculator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<CalculationResult | null>(null);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      distance: undefined,
      efficiency: undefined,
      state: '',
      fuelPrice: undefined,
    },
  });

  const selectedState = form.watch('state');

  React.useEffect(() => {
    if (selectedState) {
      const price = mockFuelPrices[selectedState] || mockFuelPrices.default;
      form.setValue('fuelPrice', price, { shouldValidate: true });
    }
  }, [selectedState, form]);

  async function onSubmit(values: TripFormValues) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be signed in to save a trip.',
      });
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    const totalFuel = values.distance / values.efficiency;
    const totalCost = totalFuel * values.fuelPrice;

    setResult({ totalFuel, totalCost });

    const tripData = {
      userId: user.uid,
      distance: values.distance,
      efficiency: values.efficiency,
      state: values.state,
      fuelPrice: values.fuelPrice,
      totalCost: totalCost,
    };

    const response = await addTrip(tripData);

    if (response.success) {
      toast({
        title: 'Success!',
        description: response.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: response.error,
      });
    }
    setIsSubmitting(false);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fuel Expense Calculator</CardTitle>
        <CardDescription>
          Estimate your trip's fuel cost based on real-time price simulations.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trip Distance (km)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 350" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="efficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle's Fuel Efficiency (km/l)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 18" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an Indian state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
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
                  <FormLabel>Fuel Price (per liter)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Auto-filled or manual entry"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                'Calculate Trip Cost'
              )}
            </Button>
            {result && (
              <div className="w-full rounded-lg border bg-muted p-4 text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  Total Fuel Needed: {result.totalFuel.toFixed(2)} liters
                </p>
                <p className="text-lg font-bold text-primary">
                  Total Trip Cost: ₹{result.totalCost.toFixed(2)}
                </p>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
