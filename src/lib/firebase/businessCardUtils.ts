import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';

export interface BusinessCard {
  id?: string;
  businessName: string;
  businessDescription?: string;
  phoneNumber: string;
  email: string;
  address: string;
  website: string;
  heroImage?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to prepare data for Firestore
const prepareDataForFirestore = (data: any) => {
  // Create a new object with only the fields we want to store
  const prepared = {
    businessName: data.businessName || '',
    businessDescription: data.businessDescription || '',
    phoneNumber: data.phoneNumber || '',
    email: data.email || '',
    address: data.address || '',
    website: data.website || '',
    heroImage: data.heroImage || '',
    userId: data.userId,
    updatedAt: Timestamp.fromDate(new Date())
  };

  // Add createdAt only for new documents
  if (!data.id) {
    prepared.createdAt = Timestamp.fromDate(new Date());
  }

  // Remove undefined values
  Object.keys(prepared).forEach(key => {
    if (prepared[key] === undefined) {
      delete prepared[key];
    }
  });

  return prepared;
};

export const saveBusinessCard = async (cardData: Omit<BusinessCard, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    if (!cardData.userId) {
      throw new Error('User ID is required');
    }

    const dataToSave = prepareDataForFirestore(cardData);
    const docRef = await addDoc(collection(db, 'businessCards'), dataToSave);
    console.log('Document saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving business card:', error);
    throw error;
  }
};

export const updateBusinessCard = async (id: string, cardData: Partial<BusinessCard>) => {
  try {
    if (!cardData.userId) {
      throw new Error('User ID is required');
    }

    const docRef = doc(db, 'businessCards', id);
    const dataToUpdate = prepareDataForFirestore(cardData);
    
    await updateDoc(docRef, dataToUpdate);
    console.log('Document updated successfully');
  } catch (error) {
    console.error('Error updating business card:', error);
    throw error;
  }
};

export const getUserBusinessCards = async (userId: string) => {
  try {
    console.log('Fetching cards for user:', userId);
    const q = query(
      collection(db, 'businessCards'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const cards = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        businessName: data.businessName || '',
        businessDescription: data.businessDescription || '',
        phoneNumber: data.phoneNumber || '',
        email: data.email || '',
        address: data.address || '',
        website: data.website || '',
        heroImage: data.heroImage || '',
        userId: data.userId,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    });
    return cards;
  } catch (error) {
    console.error('Error getting business cards:', error);
    throw error;
  }
}; 