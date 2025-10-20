
'use client';

import * as React from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from '@/context/auth-provider';
import { db } from '@/lib/firebase';
import type { Trip } from '@/app/actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { clearTripHistory } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from './ui/skeleton';

export function TripHistory() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [trips, setTrips] = React.useState<Trip[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      setLoading(true);
      const q = query(
        collection(db, 'trips'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tripsData: Trip[] = [];
        querySnapshot.forEach((doc) => {
          tripsData.push({ id: doc.id, ...doc.data() } as Trip);
        });
        setTrips(tripsData);
        setLoading(false);
      });

      return () => unsubscribe();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleClearHistory = async () => {
    if (!user) return;
    const result = await clearTripHistory(user.uid);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  const formatDate = (timestamp: Timestamp | Date) => {
    if (!timestamp) return 'N/A';
    const date = timestamp instanceof Timestamp ? timestamp.toDate() : timestamp;
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Trip History</h2>
        {trips.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  entire trip history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="rounded-lg border">
        {loading ? (
            <div className="p-4 space-y-3">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        ) : trips.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">
                    {formatDate(trip.createdAt)}
                  </TableCell>
                  <TableCell>{trip.state}</TableCell>
                  <TableCell className="text-right">
                    ₹{trip.totalCost.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>No trips recorded yet.</p>
            <p className="text-sm">
              Use the calculator above to plan and save your first trip!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
