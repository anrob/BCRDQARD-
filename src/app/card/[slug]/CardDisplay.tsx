'use client';

import { generateVCard } from '@/lib/utils/vCardGenerator';
import { useState, useEffect } from 'react';

interface CardDisplayProps {
  card: {
    businessName: string;
    businessDescription?: string;
    phoneNumber: string;
    email: string;
    address: string;
    website?: string;
    heroImage?: string;
    urlSlug?: string;
    keywords?: string[];
  };
}

export default function CardDisplay({ card }: CardDisplayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownloadVCard = () => {
    if (!mounted) return;
    
    const vCardData = generateVCard(card);
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${card.businessName.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return null; // or a loading state
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
              {card.keywords && card.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {card.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
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

            <div className="pt-4">
              <button
                onClick={handleDownloadVCard}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>📇</span>
                <span>Save Contact Information</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 