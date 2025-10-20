
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

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
  if (!tripData.userId) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    await addDoc(collection(db, 'trips'), {
      ...tripData,
      createdAt: serverTimestamp(),
    });
    revalidatePath('/');
    return { success: true, message: 'Trip saved successfully!' };
  } catch (error) {
    console.error('Error adding trip:', error);
    return { success: false, error: 'Failed to save trip.' };
  }
}

export async function clearTripHistory(userId: string) {
  if (!userId) {
    return { success: false, error: 'User not authenticated.' };
  }
  try {
    const tripsQuery = query(collection(db, 'trips'), where('userId', '==', userId));
    const querySnapshot = await getDocs(tripsQuery);
    
    if (querySnapshot.empty) {
      return { success: true, message: 'No trip history to clear.' };
    }

    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    revalidatePath('/');
    return { success: true, message: 'Trip history cleared.' };
  } catch (error) {
    console.error('Error clearing trip history:', error);
    return { success: false, error: 'Failed to clear history.' };
  }
}
