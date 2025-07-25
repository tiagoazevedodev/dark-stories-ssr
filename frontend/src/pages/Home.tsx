import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Target, Users, ArrowRight, Sparkles, Clock, Skull, Eye, Heart, Calendar, Lightbulb, Plus, LayoutDashboard } from 'lucide-react';
import { DailyCard } from '../types';
import { cardsAPI } from '../services/api';
import FlipCard from '../components/FlipCard';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const [dailyCard, setDailyCard] = useState<DailyCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">Unveiling today's mystery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <Card className="max-w-md mx-auto card-hover">
          <CardContent className="pt-6">
            <div className="text-destructive mb-4 flex items-center justify-center space-x-2">
              <Skull className="h-6 w-6" />
              <span className="font-medium">{error}</span>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const features = [
    {
      icon: Target,
      title: "Mystery Solving",
      description: "Challenge your mind with complex riddles and dark mysteries that require creative thinking.",
      color: "crimson"
    },
    {
      icon: Users,
      title: "Community Stories",
      description: "Share your own dark tales and discover mysteries created by fellow storytellers.",
      color: "amber"
    },
    {
      icon: Lightbulb,
      title: "Clever Clues",
      description: "Get hints when you're stuck, but be careful - each clue revealed costs points.",
      color: "noir"
    }
  ];

  const stats = [
    { label: "Mysteries Solved", value: "1,234+", icon: Target },
    { label: "Active Storytellers", value: "567", icon: Users },
    { label: "Daily Challenges", value: "365", icon: Calendar },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-background via-background to-noir-900/20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Hero Title */}
          <div className="space-y-4 animate-fade-in">
            <Badge variant="crimson" className="mb-4">
              <Skull className="h-3 w-3 mr-1" />
              Mystery & Suspense Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance">
              <span className="gradient-text">Black Stories</span>
              <br />
              <span className="text-foreground/90">
                {user ? `Welcome back, ${user.name}` : "Unravel the Darkness"}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
              {user ? (
                "Ready to dive into new mysteries? Explore today's challenge or create your own dark tale to share with the community."
              ) : (
                "Dive into a world of mystery and suspense. Solve dark riddles, create chilling tales, and challenge your mind with stories that will keep you on the edge."
              )}
            </p>
          </div>

          {/* CTA Buttons - Different for logged in users */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            {user ? (
              <>
                <Button size="xl" asChild className="group">
                  <Link to="/dashboard" className="flex items-center space-x-2">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Explore Mysteries</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/create-card" className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Create Mystery</span>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="xl" asChild className="group">
                  <Link to="/register" className="flex items-center space-x-2">
                    <span>Start Your Journey</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/login" className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-slide-up">
            {stats.map((stat, index) => (
              <Card key={index} className="card-hover border-border/30 bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Card Section */}
      {dailyCard && (
        <section className="section-padding bg-gradient-to-b from-noir-900/20 to-background">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="amber" className="mb-2">
                <Calendar className="h-3 w-3 mr-1" />
                Daily Challenge
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Today's Mystery
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {user ? (
                  "Here's today's featured mystery. Can you solve it before checking the clues?"
                ) : (
                  "A new dark mystery awaits every day. Can you solve today's challenge?"
                )}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <FlipCard card={dailyCard} cardType="DAILY" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{dailyCard.viewsCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{dailyCard.likesCount}</span>
                </div>
              </div>
              {user && (
                <Button asChild variant="outline">
                  <Link to={`/card/${dailyCard.id}`} className="flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>View Full Mystery</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Section - Show different content for logged users */}
      <section className="section-padding">
        <div className="text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {user ? "Your Storytelling Journey" : "Why Choose Black Stories?"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {user ? (
                "Continue exploring the depths of mystery and creativity. Your next great adventure awaits."
              ) : (
                "Immerse yourself in a world where mystery meets creativity, and every story holds a dark secret."
              )}
            </p>
          </div>

          {user ? (
            /* Logged in user - Quick actions */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="card-hover mystery-card group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-crimson-500 to-crimson-600 shadow-noir-lg group-hover:shadow-crimson transition-all duration-300">
                    <LayoutDashboard className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Explore Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <CardDescription className="leading-relaxed">
                    Browse community mysteries, track your progress, and discover new challenges.
                  </CardDescription>
                  <Button asChild className="w-full">
                    <Link to="/dashboard">
                      Go to Dashboard
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-hover mystery-card group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-amber-500 to-amber-600 shadow-noir-lg group-hover:shadow-amber transition-all duration-300">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Create Mystery</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <CardDescription className="leading-relaxed">
                    Craft your own dark tale and challenge the minds of fellow storytellers.
                  </CardDescription>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/create-card">
                      Start Creating
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-hover mystery-card group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-noir-600 to-noir-700 shadow-noir-lg group-hover:shadow-noir transition-all duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Community</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <CardDescription className="leading-relaxed">
                    Connect with other mystery enthusiasts and share your favorite stories.
                  </CardDescription>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/dashboard">
                      Join Community
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Not logged in - Feature showcase */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="card-hover mystery-card group">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${
                      feature.color === 'crimson' ? 'from-crimson-500 to-crimson-600' :
                      feature.color === 'amber' ? 'from-amber-500 to-amber-600' :
                      'from-noir-600 to-noir-700'
                    } shadow-noir-lg group-hover:shadow-${feature.color} transition-all duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Different for logged users */}
      <section className="section-padding bg-gradient-to-t from-noir-900/20 to-background">
        <Card className="max-w-4xl mx-auto mystery-card text-center">
          <CardHeader className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-crimson-500 to-amber-500 rounded-xl flex items-center justify-center shadow-noir-xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <CardTitle className="text-3xl md:text-4xl font-bold">
                {user ? "Ready for Your Next Mystery?" : "Ready to Enter the Darkness?"}
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                {user ? (
                  "Dive deeper into the world of mysteries. Create your own stories, solve community challenges, and become a master storyteller."
                ) : (
                  "Join thousands of mystery enthusiasts and start your journey into the world of dark stories. Create, solve, and share mysteries that will challenge minds and chill souls."
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Button size="lg" variant="default" asChild>
                    <Link to="/create-card" className="flex items-center space-x-2">
                      <Plus className="h-5 w-5" />
                      <span>Create New Mystery</span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/dashboard" className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Browse Mysteries</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" variant="default" asChild>
                    <Link to="/register" className="flex items-center space-x-2">
                      <Skull className="h-5 w-5" />
                      <span>Begin Your Journey</span>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/dashboard" className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Explore Mysteries</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {user ? (
                "Continue your journey into the darkness • New mysteries await"
              ) : (
                "Free to start • No credit card required • Join the darkness today"
              )}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home; 