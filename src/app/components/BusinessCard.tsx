'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { saveBusinessCard, updateBusinessCard, getUserBusinessCards, type BusinessCard as BusinessCardType } from '@/lib/firebase/businessCardUtils';

export default function BusinessCard() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cardData, setCardData] = useState<BusinessCardType>({
    businessName: '',
    phoneNumber: '',
    email: '',
    address: '',
    website: '',
    heroImage: '',
    userId: '',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load card data when component mounts or user changes
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const cards = await getUserBusinessCards(user.uid);
          if (cards.length > 0) {
            setCardData(cards[0]);
          } else {
            // If no card exists, initialize with user ID
            setCardData(prev => ({
              ...prev,
              userId: user.uid
            }));
          }
        } catch (error) {
          console.error('Error loading business card:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [user]);

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

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="w-full bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Business Card</h1>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Card'}
        </button>
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
            <div className="flex items-center space-x-3">
              <span className="text-xl font-semibold">{cardData.businessName}</span>
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
  );
} 