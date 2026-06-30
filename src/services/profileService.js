import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const profileKey = (userId) => `deadlineai_profile_${userId}`;

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const shouldUseFirestore = (userId) => Boolean(userId && userId !== 'guest');

export const defaultProfile = (seed = {}) => ({
  displayName: seed.displayName || seed.name || '',
  email: seed.email || '',
  institute: '',
  department: '',
  phone: '',
  bio: '',
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const fetchUserProfile = async (userId = 'guest') => {
  const local = readJson(profileKey(userId), null);
  if (!shouldUseFirestore(userId)) return local;

  try {
    const snap = await getDoc(doc(db, 'users', userId, 'profile', 'main'));
    if (!snap.exists()) return local;
    const remote = snap.data();
    writeJson(profileKey(userId), remote);
    return remote;
  } catch {
    return local;
  }
};

export const persistUserProfile = async (userId = 'guest', profile) => {
  const next = { ...profile, updatedAt: Date.now() };
  writeJson(profileKey(userId), next);

  if (!shouldUseFirestore(userId)) return next;

  try {
    await setDoc(doc(db, 'users', userId, 'profile', 'main'), next, { merge: true });
  } catch {
    return next;
  }

  return next;
};

