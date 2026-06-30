// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../services/firebase';
import { authenticateWithGoogle, terminateSessionNode } from '../services/auth';

export const useAuth = () => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Active connection tracker for login sessions
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photo: firebaseUser.photoURL,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        const guestEmail = localStorage.getItem('deadlineai_guest_email') || '';
        const guestName = guestEmail ? guestEmail.split('@')[0] : 'Guest Node';

        setUser(
          guestEmail
            ? {
                uid: 'guest',
                name: guestName,
                displayName: guestName,
                email: guestEmail,
                photo: null,
                photoURL: null,
              }
            : null
        );
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const loginWithGoogle = async () => {
    setLoading(true);
    const res = await authenticateWithGoogle();
    setLoading(false);
    return res;
  };

  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('deadlineai_guest_email');
    const res = await terminateSessionNode();
    setUser(null);
    setLoading(false);
    return res;
  };

  return { user, loading, loginWithGoogle, logout };
};
