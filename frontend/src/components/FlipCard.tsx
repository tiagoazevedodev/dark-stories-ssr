import React, { useState } from 'react';
import { RotateCcw, Eye, EyeOff, Heart, User, RotateCw, Skull, Lightbulb } from 'lucide-react';
import { DailyCard, CustomCard, CardType } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';

interface FlipCardProps {
  card: DailyCard | CustomCard;
  cardType: CardType;
  onLike?: () => void;
  liked?: boolean;
  likeLoading?: boolean;
  showAuthor?: boolean;
}

const FlipCard: React.FC<FlipCardProps> = ({
  card,
  cardType,
  onLike,
  liked = false,
  likeLoading = false,
  showAuthor = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    // Reset back side state when flipping to front
    if (isFlipped) {
      setCurrentClueIndex(0);
      setShowSolution(false);
    }
  };

  const nextClue = () => {
    if (currentClueIndex < card.clues.length - 1) {
      setCurrentClueIndex(currentClueIndex + 1);
    }
  };

  const prevClue = () => {
    if (currentClueIndex > 0) {
      setCurrentClueIndex(currentClueIndex - 1);
    }
  };

  return (
    <div className="flip-card-container w-full max-w-md mx-auto">
      <div 
        className={cn(
          "flip-card-inner",
          isFlipped && "flipped"
        )}
        onClick={handleFlip}
      >
        {/* FRONT SIDE - Preview */}
        <div className="flip-card-front mystery-card">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <Badge variant={cardType === 'DAILY' ? 'crimson' : 'amber'}>
              <Skull className="h-3 w-3 mr-1" />
              {cardType === 'DAILY' ? 'Daily Mystery' : 'Custom Card'}
            </Badge>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleFlip();
              }}
              className="text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Image (if available) */}
          {card.imageUrl && (
            <div className="mb-4 flex-shrink-0 overflow-hidden rounded-lg border border-border/30">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-32 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2 text-shadow">
            {card.title}
          </h3>

          {/* Teaser */}
          <p className="text-muted-foreground text-sm flex-grow mb-4 leading-relaxed">
            {card.teaser}
          </p>

          {/* Theme */}
          {card.themeRelation && (
            <div className="mb-4">
              <Badge variant="noir">
                {card.themeRelation.name}
              </Badge>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border/30 pt-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.();
                }}
                disabled={!onLike || likeLoading}
                className={cn(
                  "flex items-center space-x-1 transition-all duration-200 hover:scale-110",
                  onLike ? 'hover:text-red-400 cursor-pointer' : 'cursor-not-allowed',
                  liked && 'text-red-400'
                )}
              >
                <Heart className={cn("h-4 w-4", liked && "fill-current")} />
                <span className="font-medium">{card.likesCount}</span>
              </button>
              
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span className="font-medium">{card.viewsCount}</span>
              </div>
            </div>
            
            {showAuthor && 'user' in card && card.user && (
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span className="text-xs">{card.user.name}</span>
              </div>
            )}
          </div>

          {/* Flip instruction */}
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground/70 flex items-center justify-center space-x-1">
              <RotateCw className="h-3 w-3" />
              <span>Click to reveal master view</span>
            </p>
          </div>
        </div>

        {/* BACK SIDE - Master View */}
        <div className="flip-card-back">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-glow"></div>
              <EyeOff className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Master View</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleFlip();
              }}
              className="text-muted-foreground hover:text-foreground border border-border/50 hover:border-primary/50"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold mb-4 text-shadow border-b border-border/30 pb-2">
            {card.title}
          </h3>

          {!showSolution ? (
            <div className="flex-grow flex flex-col">
              {/* Clue Navigation */}
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-medium text-foreground">
                      Clue {currentClueIndex + 1} of {card.clues.length}
                    </span>
                  </div>
                  
                  <div className="flex space-x-1">
                    {card.clues.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-200",
                          index === currentClueIndex 
                            ? "bg-primary shadow-crimson" 
                            : index < currentClueIndex 
                              ? "bg-primary/60" 
                              : "bg-border"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="glass-effect rounded-lg p-4 mb-6 min-h-[100px] flex items-center">
                  <p className="text-sm leading-relaxed text-foreground">
                    {card.clues[currentClueIndex]}
                  </p>
                </div>

                {/* Clue Navigation Buttons */}
                <div className="flex justify-center space-x-3 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevClue();
                    }}
                    disabled={currentClueIndex === 0}
                    className="flex items-center space-x-2"
                  >
                    <span>Previous</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextClue();
                    }}
                    disabled={currentClueIndex === card.clues.length - 1}
                    className="flex items-center space-x-2"
                  >
                    <span>Next</span>
                  </Button>
                </div>
              </div>

              {/* Reveal Solution Button */}
              <div className="text-center">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSolution(true);
                  }}
                  variant="destructive"
                  className="shadow-crimson hover:shadow-crimson"
                >
                  <Skull className="h-4 w-4 mr-2" />
                  Reveal Solution
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col">
              {/* Solution */}
              <div className="flex-grow">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-medium text-sm">Solution Revealed!</span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
                    <p className="text-sm leading-relaxed text-foreground">
                      {card.solution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Back to Clues Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSolution(false);
                  }}
                  className="mr-2"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Back to Clues
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlipCard; 