import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DailyCard } from '../types';
import { cardsAPI } from '../services/api';

const Home: React.FC = () => {
  const [dailyCard, setDailyCard] = useState<DailyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyCard = async () => {
      try {
        const response = await cardsAPI.getDailyCard();
        setDailyCard(response.card);
      } catch (error) {
        setError('Failed to load daily card');
      } finally {
        setLoading(false);
      }
    };

    fetchDailyCard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Black Stories
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Solve mysterious stories with creative thinking and clever questions
        </p>
      </div>

      {dailyCard ? (
        <div className="card max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-4">
              Daily Mystery
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {dailyCard.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {dailyCard.teaser}
            </p>
          </div>

          {dailyCard.imageUrl && (
            <div className="mb-6">
              <img
                src={dailyCard.imageUrl}
                alt={dailyCard.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>❤️ {dailyCard.likesCount} likes</span>
              <span>👁️ {dailyCard.viewsCount} views</span>
              {dailyCard.themeRelation && (
                <span className="px-2 py-1 bg-gray-100 rounded-full">
                  {dailyCard.themeRelation.name}
                </span>
              )}
            </div>
          </div>

          <div className="text-center">
            <Link
              to={`/card/${dailyCard.id}`}
              className="btn-primary inline-block"
            >
              Solve This Mystery
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">No daily card available today</div>
          <Link to="/dashboard" className="btn-primary">
            Explore Custom Cards
          </Link>
        </div>
      )}

      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🕵️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Solve Mysteries</h3>
          <p className="text-gray-600">
            Use your detective skills to unravel complex puzzles and stories
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✍️</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Create Stories</h3>
          <p className="text-gray-600">
            Craft your own mysterious stories and share them with the community
          </p>
        </div>

        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏆</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Challenge Friends</h3>
          <p className="text-gray-600">
            Share puzzles with friends and see who can solve them fastest
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 