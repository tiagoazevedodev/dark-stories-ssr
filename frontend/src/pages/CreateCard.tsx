import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, BookOpen, Lightbulb, Target, ArrowRight, Sparkles, X, Check } from 'lucide-react';
import { Theme } from '../types';
import { cardsAPI, themesAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const CreateCard: React.FC = () => {
  const [title, setTitle] = useState('');
  const [teaser, setTeaser] = useState('');
  const [clues, setClues] = useState(['', '', '']);
  const [solution, setSolution] = useState('');
  const [themeId, setThemeId] = useState<number | undefined>();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await themesAPI.getThemes();
        setThemes(response.themes);
      } catch (error) {
        console.error('Failed to load themes');
      }
    };

    fetchThemes();
  }, []);

  const handleClueChange = (index: number, value: string) => {
    const newClues = [...clues];
    newClues[index] = value;
    setClues(newClues);
  };

  const addClue = () => {
    if (clues.length < 10) {
      setClues([...clues, '']);
    }
  };

  const removeClue = (index: number) => {
    if (clues.length > 1) {
      const newClues = clues.filter((_, i) => i !== index);
      setClues(newClues);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Filter out empty clues
    const filteredClues = clues.filter(clue => clue.trim() !== '');

    if (filteredClues.length === 0) {
      setError('Please add at least one clue');
      setLoading(false);
      return;
    }

    if (!title.trim() || !teaser.trim() || !solution.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const selectedTheme = themes.find(t => t.id === themeId);
      const response = await cardsAPI.createCustomCard({
        title: title.trim(),
        teaser: teaser.trim(),
        clues: filteredClues,
        solution: solution.trim(),
        theme: selectedTheme?.name,
        themeId,
      });

      navigate(`/card/${response.card.id}`);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-crimson-500 to-amber-500 rounded-xl flex items-center justify-center shadow-noir-xl">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Create Mystery Card
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Craft an engaging mystery that will challenge minds and spark imagination. 
              Every great story starts with a compelling setup.
            </p>
          </div>
          <Badge variant="amber" className="inline-flex">
            <Sparkles className="h-3 w-3 mr-1" />
            Mystery Creator
          </Badge>
        </div>

        {/* Form */}
        <Card className="mystery-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Mystery Details</span>
            </CardTitle>
            <CardDescription>
              Fill in the details below to create your mysterious story
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  <div className="flex items-center space-x-2">
                    <X className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-3">
                <Label htmlFor="title" className="text-base font-semibold">
                  Mystery Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter an intriguing title that hints at the mystery..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-12 text-base"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {title.length}/100 characters • Make it mysterious and compelling
                </p>
              </div>

              {/* Teaser */}
              <div className="space-y-3">
                <Label htmlFor="teaser" className="text-base font-semibold">
                  Mystery Setup *
                </Label>
                <Textarea
                  id="teaser"
                  value={teaser}
                  onChange={(e) => setTeaser(e.target.value)}
                  rows={4}
                  placeholder="Describe the mysterious situation that needs solving. Set the scene and present the puzzle..."
                  required
                  className="text-base resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {teaser.length}/500 characters • Describe the initial situation clearly
                </p>
              </div>

              {/* Clues */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <span>Clues * ({clues.filter(c => c.trim()).length} active)</span>
                  </Label>
                  <Button
                    type="button"
                    onClick={addClue}
                    variant="outline"
                    size="sm"
                    disabled={clues.length >= 10}
                    className="flex items-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Clue</span>
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {clues.map((clue, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <Textarea
                            value={clue}
                            onChange={(e) => handleClueChange(index, e.target.value)}
                            placeholder={`Clue ${index + 1}: Provide a hint that guides towards the solution...`}
                            rows={2}
                            className="resize-none"
                            maxLength={200}
                          />
                        </div>
                        {clues.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeClue(index)}
                            variant="outline"
                            size="icon"
                            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:border-destructive hover:text-destructive"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {clue && (
                        <p className="text-xs text-muted-foreground mt-1 ml-11">
                          {clue.length}/200 characters
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-muted/20 border border-border/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Good clues progressively guide players toward the solution. 
                    Start vague and become more specific. Think about what yes/no questions players might ask.
                  </p>
                </div>
              </div>

              {/* Solution */}
              <div className="space-y-3">
                <Label htmlFor="solution" className="text-base font-semibold">
                  Solution *
                </Label>
                <Textarea
                  id="solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={4}
                  placeholder="Reveal the complete solution to your mystery. Explain how everything connects..."
                  required
                  className="text-base resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">
                  {solution.length}/1000 characters • Provide a clear and satisfying explanation
                </p>
              </div>

              {/* Theme */}
              <div className="space-y-3">
                <Label htmlFor="theme" className="text-base font-semibold">
                  Theme (Optional)
                </Label>
                <div className="relative">
                  <select
                    id="theme"
                    value={themeId || ''}
                    onChange={(e) => setThemeId(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full h-12 px-4 py-3 bg-input border border-border rounded-lg text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a theme...</option>
                    {themes.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose a theme to help categorize your mystery
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border/30">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !title.trim() || !teaser.trim() || !solution.trim()}
                  className="flex-1 h-12 group"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Creating Mystery...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4" />
                      <span>Create Mystery</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2 text-amber-400">
              <Lightbulb className="h-5 w-5" />
              <span>Pro Tips for Great Mysteries</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Setup</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Present a clear, intriguing situation</li>
                  <li>• Include all necessary context</li>
                  <li>• Make it sound impossible or strange</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Clues</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Guide players step by step</li>
                  <li>• Think about yes/no questions</li>
                  <li>• Reveal information progressively</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCard; 