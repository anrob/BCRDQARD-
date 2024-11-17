import { db } from '@/lib/firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import CardDisplay from './CardDisplay';
import { BusinessCard } from '@/lib/firebase/businessCardUtils';

// Type for the card data returned by getCardBySlug
type CardData = Omit<BusinessCard, 'userId'>;

async function getCardBySlug(slug: string): Promise<CardData | null> {
  const q = query(
    collection(db, 'businessCards'),
    where('urlSlug', '==', slug)
  );
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
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
    urlSlug: data.urlSlug || '',
    keywords: data.keywords || [],
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
}

// Update the Props type to match Next.js 14 App Router requirements
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Add metadata export for Next.js App Router
export const metadata = {
  title: 'Business Card',
  description: 'View business card details',
};

export default async function CardPage({
  params,
  searchParams,
}: Props) {
  const { slug } = params;
  
  const card = await getCardBySlug(slug);

  if (!card) {
    notFound();
  }

  return <CardDisplay card={card} />;
} 