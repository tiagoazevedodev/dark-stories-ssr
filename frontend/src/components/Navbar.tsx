import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Plus, Home, LayoutDashboard, Skull, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-crimson-500 to-amber-500 rounded-lg flex items-center justify-center shadow-noir-lg group-hover:shadow-crimson transition-all duration-300">
                  <Skull className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-crimson-500 to-amber-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text group-hover:text-glow transition-all duration-300">
                  Black Stories
                </span>
                <span className="text-xs text-muted-foreground/80 font-medium">
                  Mystery & Suspense
                </span>
              </div>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-1">

              {user && (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/" className="nav-link flex items-center space-x-2">
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard" className="nav-link flex items-center space-x-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </Button>

                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/create-card" className="nav-link flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Create</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-crimson-600 to-crimson-500 rounded-full flex items-center justify-center shadow-noir">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {user.name}
                      </span>
                      <Badge variant="crimson" className="text-xs">
                        Storyteller
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 hover:border-destructive/50 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Theme indicator */}
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-noir-800 border border-noir-600 flex items-center justify-center">
                <Moon className="h-3 w-3 text-noir-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className="md:hidden border-t border-border/30 py-2">
            <div className="flex items-center justify-around space-x-1">
              <Button variant="ghost" size="sm" asChild className="flex-1">
                <Link to="/" className="flex flex-col items-center space-y-1 py-2">
                  <Home className="h-4 w-4" />
                  <span className="text-xs">Home</span>
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild className="flex-1">
                <Link to="/dashboard" className="flex flex-col items-center space-y-1 py-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="text-xs">Dashboard</span>
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild className="flex-1">
                <Link to="/create-card" className="flex flex-col items-center space-y-1 py-2">
                  <Plus className="h-4 w-4" />
                  <span className="text-xs">Create</span>
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 