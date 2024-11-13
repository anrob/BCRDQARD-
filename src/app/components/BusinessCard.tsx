'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { QRCodeSVG } from 'qrcode.react';
import { saveBusinessCard, updateBusinessCard, getUserBusinessCards, type BusinessCard as BusinessCardType } from '@/lib/firebase/businessCardUtils';

interface BusinessCardProps {
  selectedCardId: string | null;
  onCardSelect: (cardId: string | null) => void;
  hideSelector?: boolean;
}

export default function BusinessCard({ selectedCardId, onCardSelect, hideSelector = false }: BusinessCardProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allCards, setAllCards] = useState<BusinessCardType[]>([]);
  const [cardData, setCardData] = useState<BusinessCardType>({
    businessName: '',
    businessDescription: '',
    phoneNumber: '',
    email: '',
    address: '',
    website: '',
    heroImage: '',
    userId: '',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [newKeyword, setNewKeyword] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load all cards when component mounts or user changes
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const cards = await getUserBusinessCards(user.uid);
          setAllCards(cards);
          
          if (selectedCardId) {
            const selectedCard = cards.find(card => card.id === selectedCardId);
            if (selectedCard) {
              setCardData(selectedCard);
            } else {
              // If selected card not found in current user's cards, reset selection
              setCardData({
                businessName: '',
                businessDescription: '',
                phoneNumber: '',
                email: '',
                address: '',
                website: '',
                heroImage: '',
                userId: user.uid,
                urlSlug: `card-${Math.random().toString(36).substr(2, 6)}`,
                keywords: [],
                createdAt: new Date(),
                updatedAt: new Date()
              });
              onCardSelect(null);
            }
          } else if (cards.length > 0) {
            // If no card selected but cards exist, select the first one
            setCardData(cards[0]);
            onCardSelect(cards[0].id!);
          } else {
            // If no cards exist, initialize new card
            setCardData({
              businessName: '',
              businessDescription: '',
              phoneNumber: '',
              email: '',
              address: '',
              website: '',
              heroImage: '',
              userId: user.uid,
              urlSlug: `card-${Math.random().toString(36).substr(2, 6)}`,
              keywords: [],
              createdAt: new Date(),
              updatedAt: new Date()
            });
            setIsEditing(true);
          }
        } catch (error) {
          console.error('Error loading business cards:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [user, selectedCardId, onCardSelect]);

  useEffect(() => {
    if (cardData.urlSlug) {
      setQrCodeUrl(`${window.location.origin}/card/${cardData.urlSlug}`);
    }
  }, [cardData.urlSlug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const dataToSave = {
        ...cardData,
        userId: user.uid
      };

      if (cardData.id) {
        await updateBusinessCard(cardData.id, dataToSave);
      } else {
        const cardId = await saveBusinessCard(dataToSave);
        setCardData(prev => ({ ...prev, id: cardId }));
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving business card:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardData({ ...cardData, heroImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Update keyword handler to handle Enter key
  const handleKeywordInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword(e);
    }
  };

  // Modified Add keyword handler
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    
    if (!cardData.keywords) {
      cardData.keywords = [];
    }
    
    if (cardData.keywords.length >= 3) { // Changed from 4 to 3
      alert('Maximum 3 keywords allowed');
      return;
    }

    setCardData(prev => ({
      ...prev,
      keywords: [...(prev.keywords || []), newKeyword.trim()]
    }));
    setNewKeyword('');
  };

  // Remove keyword handler
  const handleRemoveKeyword = (keywordToRemove: string) => {
    setCardData(prev => ({
      ...prev,
      keywords: (prev.keywords || []).filter(k => k !== keywordToRemove)
    }));
  };

  // Add card selector to the UI
  return (
    <div className="max-w-md mx-auto">
      {!hideSelector && allCards.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Card</label>
          <select
            value={selectedCardId || ''}
            onChange={(e) => onCardSelect(e.target.value || null)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a card</option>
            {allCards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.businessName || 'Untitled Card'}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="w-full bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Business Card</h1>
          </div>
          <div className="flex items-center space-x-2">
            {cardData.id && cardData.urlSlug && (  // Check for both id and urlSlug
              <a
                href={`/card/${cardData.urlSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Live URL
              </a>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Card'}
            </button>
          </div>
        </div>

        <div className="relative w-full h-48">
          {cardData.heroImage ? (
            <img
              src={cardData.heroImage}
              alt="Business hero"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image uploaded</span>
            </div>
          )}
          
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white rounded-md text-gray-800 hover:bg-gray-100 transition-colors"
              >
                {cardData.heroImage ? 'Change Image' : 'Upload Image'}
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input
                  type="text"
                  value={cardData.businessName}
                  onChange={(e) => setCardData({ ...cardData, businessName: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Keywords (max 3)</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cardData.keywords?.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {(cardData.keywords?.length || 0) < 3 && ( // Changed from 4 to 3
                  <div className="mt-2 flex">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyDown={handleKeywordInputKeyDown} // Add this line
                      className="flex-1 p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a keyword and press Enter"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Description</label>
                <textarea
                  value={cardData.businessDescription}
                  onChange={(e) => setCardData({ ...cardData, businessDescription: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a brief business description"
                  maxLength={250}
                  rows={3}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {(cardData.businessDescription?.length || 0)}/250 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={cardData.phoneNumber}
                  onChange={(e) => setCardData({ ...cardData, phoneNumber: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={cardData.email}
                  onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={cardData.address}
                  onChange={(e) => setCardData({ ...cardData, address: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={cardData.website}
                  onChange={(e) => setCardData({ ...cardData, website: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter website URL"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <span className="text-xl font-semibold">{cardData.businessName}</span>
                {cardData.keywords && cardData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cardData.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
                {cardData.businessDescription && (
                  <p className="text-gray-600">{cardData.businessDescription}</p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <span>📞</span>
                <span>{cardData.phoneNumber}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span>✉️</span>
                <span>{cardData.email}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span>📍</span>
                <span>{cardData.address}</span>
              </div>

              {cardData.website && (
                <div className="flex items-center space-x-3">
                  <span>🌐</span>
                  <a 
                    href={cardData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {cardData.website}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!isEditing && cardData.id && cardData.urlSlug && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 text-center">
          <h2 className="text-lg font-semibold mb-4">Share your business card</h2>
          <div className="flex justify-center">
            {qrCodeUrl && (
              <QRCodeSVG
                value={qrCodeUrl}
                size={200}
                level="H"
                includeMargin={true}
                className="mx-auto"
              />
            )}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Scan this QR code to view your business card on any device
          </p>
        </div>
      )}
    </div>
  );
} 