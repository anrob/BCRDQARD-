import { db } from '@/lib/firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import CardDisplay from './CardDisplay';

async function getCardBySlug(slug: string) {
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
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  };
}

export default async function PublicCard({ params }: { params: { slug: string } }) {
  const card = await getCardBySlug(params.slug);

  if (!card) {
    notFound();
  }

  return <CardDisplay card={card} />;
} 