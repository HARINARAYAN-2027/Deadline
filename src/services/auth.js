// src/services/auth.js
import { app } from './firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google Sign-In Method Node
export const authenticateWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Google identity matrix successfully retrieved
    const user = result.user;
    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        displayName: user.displayName,
        photo: user.photoURL,
        photoURL: user.photoURL,
      }
    };
  } catch (error) {
    console.error("Google Authentication Matrix Failure:", error);
    return { success: false, error: error.message };
  }
};

// Terminate Session Node
export const terminateSessionNode = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout Failure:", error);
    return { success: false, error: error.message };
  }
};
