import { db } from '@/lib/firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { notFound } from 'next/navigation';

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

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {card.heroImage && (
          <div className="w-full h-48">
            <img
              src={card.heroImage}
              alt="Business hero"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-xl font-semibold">{card.businessName}</h1>
            {card.businessDescription && (
              <p className="text-gray-600">{card.businessDescription}</p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <span>📞</span>
            <span>{card.phoneNumber}</span>
          </div>

          <div className="flex items-center space-x-3">
            <span>✉️</span>
            <span>{card.email}</span>
          </div>

          <div className="flex items-center space-x-3">
            <span>📍</span>
            <span>{card.address}</span>
          </div>

          {card.website && (
            <div className="flex items-center space-x-3">
              <span>🌐</span>
              <a 
                href={card.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {card.website}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 