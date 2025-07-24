import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DailyCard, CustomCard, CardType } from '../types';
import { cardsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<DailyCard | CustomCard | null>(null);
  const [cardType, setCardType] = useState<CardType>('DAILY');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return;

      try {
        // Try fetching as daily card first
        let response;
        try {
          response = await cardsAPI.getDailyCardById(id);
          setCard(response.card);
          setCardType('DAILY');
        } catch {
          // If not found, try as custom card
          response = await cardsAPI.getCustomCardById(id);
          setCard(response.card);
          setCardType('CUSTOM');
        }
      } catch (error) {
        setError('Card not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const handleLike = async () => {
    if (!user || !card) return;

    setLikeLoading(true);
    try {
      const response = await cardsAPI.likeCard(card.id, cardType);
      setLiked(response.liked);
      
      // Update like count
      setCard(prev => prev ? {
        ...prev,
        likesCount: response.liked ? prev.likesCount + 1 : prev.likesCount - 1
      } : null);
    } catch (error) {
      console.error('Failed to toggle like');
    } finally {
      setLikeLoading(false);
    }
  };

  const nextClue = () => {
    if (card && currentClueIndex < card.clues.length - 1) {
      setCurrentClueIndex(currentClueIndex + 1);
    }
  };

  const prevClue = () => {
    if (currentClueIndex > 0) {
      setCurrentClueIndex(currentClueIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Card not found'}</div>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-primary-600 hover:text-primary-700 flex items-center">
          ← Back to Home
        </Link>
      </div>

      <div className="card">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              cardType === 'DAILY' 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {cardType === 'DAILY' ? 'Daily Mystery' : 'Custom Card'}
            </span>
            {card.themeRelation && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {card.themeRelation.name}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {card.title}
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {card.teaser}
          </p>

          {card.imageUrl && (
            <div className="mb-6">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full max-w-lg mx-auto rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                disabled={!user || likeLoading}
                className={`flex items-center space-x-1 ${
                  user ? 'hover:text-red-500 cursor-pointer' : 'cursor-not-allowed'
                } ${liked ? 'text-red-500' : ''}`}
              >
                <span>❤️</span>
                <span>{card.likesCount}</span>
              </button>
            </div>
            <div className="flex items-center space-x-1">
              <span>👁️</span>
              <span>{card.viewsCount}</span>
            </div>
            {'user' in card && (
              <div className="flex items-center space-x-1">
                <span>👤</span>
                <span>by {card.user?.name}</span>
              </div>
            )}
          </div>
        </div>

        {!showSolution ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Clue {currentClueIndex + 1} of {card.clues.length}
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-gray-800">
                  {card.clues[currentClueIndex]}
                </p>
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={prevClue}
                  disabled={currentClueIndex === 0}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous Clue
                </button>
                <button
                  onClick={nextClue}
                  disabled={currentClueIndex === card.clues.length - 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Clue
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowSolution(true)}
                  className="btn-primary"
                >
                  Reveal Solution
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-green-600">
              🎉 Solution Revealed!
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-lg text-gray-800">
                {card.solution}
              </p>
            </div>
            <button
              onClick={() => setShowSolution(false)}
              className="btn-secondary mr-4"
            >
              Hide Solution
            </button>
            <Link to="/" className="btn-primary">
              Solve Another Mystery
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardDetail; 