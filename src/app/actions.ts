
'use server';

export type Trip = {
  id?: string;
  userId: string;
  distance: number;
  efficiency: number;
  state: string;
  fuelPrice: number;
  totalCost: number;
  createdAt: any;
};

export async function addTrip(tripData: Omit<Trip, 'id' | 'createdAt'>) {
  // This function is disabled as API integration has been removed.
  console.log('Trip saving is disabled.');
  return { success: false, error: 'Trip saving is currently disabled.' };
}

export async function clearTripHistory(userId: string) {
  // This function is disabled as API integration has been removed.
  console.log('History clearing is disabled.');
  return { success: false, error: 'History clearing is currently disabled.' };
}
