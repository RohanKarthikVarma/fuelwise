
import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';

let app: App;
let db: Firestore;
let auth: Auth;

try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }
    const serviceAccount = JSON.parse(serviceAccountString);

    if (!getApps().length) {
      app = initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      app = getApp();
    }
    
    db = getFirestore(app);
    auth = getAuth(app);

} catch (error) {
    console.error('Firebase Admin initialization error:', error);
    // Provide dummy instances or handle the error as appropriate for your application
    // This is to prevent crashing during build or in environments where keys aren't available
    if (!getApps().length) {
      app = initializeApp();
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    auth = getAuth(app);
}


export { app, db, auth };
