import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs,
  query,
  where,
  DocumentData 
} from 'firebase/firestore';

export interface BusinessCard {
  id?: string;
  businessName: string;
  phoneNumber: string;
  email: string;
  address: string;
  website: string;
  heroImage?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const saveBusinessCard = async (cardData: Omit<BusinessCard, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'businessCards'), {
      ...cardData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving business card:', error);
    throw error;
  }
};

export const updateBusinessCard = async (id: string, cardData: Partial<BusinessCard>) => {
  try {
    const docRef = doc(db, 'businessCards', id);
    await updateDoc(docRef, {
      ...cardData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating business card:', error);
    throw error;
  }
};

export const getUserBusinessCards = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'businessCards'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BusinessCard[];
  } catch (error) {
    console.error('Error getting business cards:', error);
    throw error;
  }
}; 