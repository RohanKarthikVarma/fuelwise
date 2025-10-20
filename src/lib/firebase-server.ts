
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

const app = !getApps().length
  ? initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : undefined,
    })
  : getApp();

const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
