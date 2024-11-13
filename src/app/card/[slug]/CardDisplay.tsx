'use client';

import { generateVCard } from '@/lib/utils/vCardGenerator';

export default function CardDisplay({ card }) {
  const handleDownloadVCard = () => {
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
  );
} 