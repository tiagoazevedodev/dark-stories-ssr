import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DailyCard, CustomCard, CardType } from '../types';
import { cardsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FlipCard from '../components/FlipCard';
import { Button } from '../components/ui/button';

const CardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<DailyCard | CustomCard | null>(null);
  const [cardType, setCardType] = useState<CardType>('DAILY');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="text-primary-600 hover:text-primary-700">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>

      {/* Layout with FlipCard and Instructions */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* FlipCard */}
        <div className="perspective-1000">
          <FlipCard
            card={card}
            cardType={cardType}
            onLike={user ? handleLike : undefined}
            liked={liked}
            likeLoading={likeLoading}
            showAuthor={cardType === 'CUSTOM'}
          />
        </div>

        {/* Instructions and Info */}
        <div className="space-y-6">
          {/* How to Play */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Play</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                <p>Read the mysterious scenario on the front of the card</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <p>Click the rotate icon to flip to the "Master View" (back)</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                <p>The Game Master reads clues one by one to help players guess</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">4</span>
                <p>Players ask yes/no questions based on the clues</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">5</span>
                <p>Reveal the solution when players are ready or stuck</p>
              </div>
            </div>
          </div>

          {/* Game Master Instructions */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">📖 Game Master Tips</h3>
            <ul className="text-sm text-amber-800 space-y-2">
              <li>• Only you should see the back of the card (clues & solution)</li>
              <li>• Give clues gradually - don't reveal everything at once</li>
              <li>• Answer players' yes/no questions based on the solution</li>
              <li>• Encourage creative thinking and lateral reasoning</li>
              <li>• Have fun and don't be afraid to give hints if players are stuck!</li>
            </ul>
          </div>

          {/* Card Stats */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Card Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Likes</span>
                <div className="text-lg font-semibold text-gray-900">{card.likesCount}</div>
              </div>
              <div>
                <span className="text-gray-500">Views</span>
                <div className="text-lg font-semibold text-gray-900">{card.viewsCount}</div>
              </div>
              <div>
                <span className="text-gray-500">Clues</span>
                <div className="text-lg font-semibold text-gray-900">{card.clues.length}</div>
              </div>
              <div>
                <span className="text-gray-500">Type</span>
                <div className="text-lg font-semibold text-gray-900">
                  {cardType === 'DAILY' ? 'Daily' : 'Custom'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button asChild className="flex-1">
              <Link to="/">Explore More Cards</Link>
            </Button>
            {user && (
              <Button variant="outline" asChild className="flex-1">
                <Link to="/create-card">Create Your Own</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail; 