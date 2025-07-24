import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CustomCard } from '../types';
import { cardsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const [customCards, setCustomCards] = useState<CustomCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCustomCards = async () => {
      try {
        const response = await cardsAPI.getCustomCards();
        setCustomCards(response.cards);
      } catch (error) {
        setError('Failed to load your cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomCards();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your custom mystery cards</p>
        </div>
        <Link to="/create-card" className="btn-primary">
          Create New Card
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {customCards.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-gray-400">📝</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No cards yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first mystery card to get started
          </p>
          <Link to="/create-card" className="btn-primary">
            Create Your First Card
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customCards.map((card) => (
            <div key={card.id} className="card hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Custom
                  </span>
                  {card.themeRelation && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {card.themeRelation.name}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {card.teaser}
                </p>
              </div>

              {card.imageUrl && (
                <div className="mb-4">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-3">
                  <span>❤️ {card.likesCount}</span>
                  <span>👁️ {card.viewsCount}</span>
                </div>
                <span>{new Date(card.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/card/${card.id}`}
                  className="flex-1 text-center py-2 px-4 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  View
                </Link>
                <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="card bg-primary-50 border-primary-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-primary-900 mb-1">
              {customCards.length}
            </h3>
            <p className="text-primary-700 text-sm">Cards Created</p>
          </div>
        </div>

        <div className="card bg-green-50 border-green-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">❤️</span>
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-1">
              {customCards.reduce((total, card) => total + card.likesCount, 0)}
            </h3>
            <p className="text-green-700 text-sm">Total Likes</p>
          </div>
        </div>

        <div className="card bg-blue-50 border-blue-200">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">👁️</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-1">
              {customCards.reduce((total, card) => total + card.viewsCount, 0)}
            </h3>
            <p className="text-blue-700 text-sm">Total Views</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 