import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Theme } from '../types';
import { cardsAPI, themesAPI } from '../services/api';

const CreateCard: React.FC = () => {
  const [title, setTitle] = useState('');
  const [teaser, setTeaser] = useState('');
  const [clues, setClues] = useState(['', '', '']);
  const [solution, setSolution] = useState('');
  const [themeId, setThemeId] = useState<number | undefined>();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    setClues([...clues, '']);
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
    setError(null);

    // Filter out empty clues
    const filteredClues = clues.filter(clue => clue.trim() !== '');

    if (filteredClues.length === 0) {
      setError('Please add at least one clue');
      setLoading(false);
      return;
    }

    try {
      const selectedTheme = themes.find(t => t.id === themeId);
      const response = await cardsAPI.createCustomCard({
        title,
        teaser,
        clues: filteredClues,
        solution,
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
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Mystery Card</h1>
          <p className="text-gray-600">Craft an engaging mystery for others to solve</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Enter an intriguing title"
              required
            />
          </div>

          <div>
            <label htmlFor="teaser" className="block text-sm font-medium text-gray-700 mb-2">
              Teaser / Setup *
            </label>
            <textarea
              id="teaser"
              value={teaser}
              onChange={(e) => setTeaser(e.target.value)}
              rows={3}
              className="input-field"
              placeholder="Describe the mysterious situation that needs solving..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clues *
            </label>
            <div className="space-y-3">
              {clues.map((clue, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={clue}
                    onChange={(e) => handleClueChange(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder={`Clue ${index + 1}`}
                  />
                  {clues.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeClue(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addClue}
                className="btn-secondary text-sm"
              >
                Add Another Clue
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
              Solution *
            </label>
            <textarea
              id="solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={3}
              className="input-field"
              placeholder="Reveal the solution to your mystery..."
              required
            />
          </div>

          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
              Theme (Optional)
            </label>
            <select
              id="theme"
              value={themeId || ''}
              onChange={(e) => setThemeId(e.target.value ? Number(e.target.value) : undefined)}
              className="input-field"
            >
              <option value="">Select a theme...</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCard; 