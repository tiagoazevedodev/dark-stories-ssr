import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Heart, Calendar, TrendingUp, Edit, Skull, Sparkles } from 'lucide-react';
import { CustomCard } from '../types';
import { cardsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading your mysteries...</p>
        </div>
      </div>
    );
  }

  const totalLikes = customCards.reduce((total, card) => total + card.likesCount, 0);
  const totalViews = customCards.reduce((total, card) => total + card.viewsCount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow"></div>
            <Badge variant="mystery">
              <Skull className="h-3 w-3 mr-1" />
              Mystery Creator Dashboard
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, <span className="gradient-text">{user?.name}</span>!
          </h1>
          
          <p className="text-muted-foreground text-lg">
            Manage your collection of dark mysteries and enigmatic tales
          </p>
        </div>
        
        <Button asChild size="lg" variant="mystery" className="group">
          <Link to="/create-card" className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create New Mystery</span>
            <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
          </Link>
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="text-destructive flex items-center justify-center space-x-2">
              <Skull className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/20 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Skull className="h-4 w-4 text-primary" />
              </div>
              <span>Mysteries Created</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">
              {customCards.length}
            </div>
            <p className="text-sm text-muted-foreground">
              Dark stories waiting to be solved
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-red-400" />
              </div>
              <span>Total Likes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">
              {totalLikes}
            </div>
            <p className="text-sm text-muted-foreground">
              Hearts captured by your mysteries
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-400" />
              </div>
              <span>Total Views</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-2">
              {totalViews}
            </div>
            <p className="text-sm text-muted-foreground">
              Curious minds engaged
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards Section */}
      {customCards.length === 0 ? (
        <Card className="border-primary/20 mystery-glow">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Skull className="h-10 w-10 text-primary" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-foreground">No Mysteries Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your collection awaits its first dark tale. Create a mysterious story 
                  that will challenge and intrigue other players.
                </p>
              </div>
              
              <Button asChild size="lg" variant="mystery">
                <Link to="/create-card" className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Create Your First Mystery</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Your Mysteries</h2>
            <Badge variant="outline">
              {customCards.length} {customCards.length === 1 ? 'story' : 'stories'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {customCards.map((card) => (
              <Card key={card.id} className="mystery-card hover-lift hover-glow group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="custom">
                      <Skull className="h-3 w-3 mr-1" />
                      Custom Mystery
                    </Badge>
                    
                    {card.themeRelation && (
                      <Badge variant="theme" className="text-xs">
                        {card.themeRelation.name}
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                    {card.title}
                  </CardTitle>
                  
                  <CardDescription className="line-clamp-3 leading-relaxed">
                    {card.teaser}
                  </CardDescription>
                </CardHeader>

                {card.imageUrl && (
                  <div className="px-6 pb-4">
                    <div className="overflow-hidden rounded-lg border border-border/30">
                      <img
                        src={card.imageUrl}
                        alt={card.title}
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                )}

                <CardContent className="pt-0">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pt-4 border-t border-border/30">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4 text-red-400" />
                        <span className="font-medium">{card.likesCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4 text-blue-400" />
                        <span className="font-medium">{card.viewsCount}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">
                        {new Date(card.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" asChild className="group/btn">
                      <Link to={`/card/${card.id}`} className="flex items-center justify-center space-x-2">
                        <Eye className="h-4 w-4 group-hover/btn:text-primary transition-colors" />
                        <span>View</span>
                      </Link>
                    </Button>
                    
                    <Button variant="secondary" size="sm" asChild className="group/btn">
                      <Link to={`/edit-card/${card.id}`} className="flex items-center justify-center space-x-2">
                        <Edit className="h-4 w-4 group-hover/btn:text-primary transition-colors" />
                        <span>Edit</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Performance Insights */}
      {customCards.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Mystery Performance</span>
            </CardTitle>
            <CardDescription>
              Insights about your most popular mysteries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Most Liked Mystery</h4>
                {customCards.length > 0 && (
                  <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
                    <Heart className="h-4 w-4 text-red-400" />
                    <div>
                      <p className="font-medium text-sm">
                        {customCards.reduce((prev, current) => 
                          prev.likesCount > current.likesCount ? prev : current
                        ).title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {customCards.reduce((prev, current) => 
                          prev.likesCount > current.likesCount ? prev : current
                        ).likesCount} likes
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Most Viewed Mystery</h4>
                {customCards.length > 0 && (
                  <div className="flex items-center space-x-3 p-3 glass-effect rounded-lg">
                    <Eye className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="font-medium text-sm">
                        {customCards.reduce((prev, current) => 
                          prev.viewsCount > current.viewsCount ? prev : current
                        ).title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {customCards.reduce((prev, current) => 
                          prev.viewsCount > current.viewsCount ? prev : current
                        ).viewsCount} views
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard; 