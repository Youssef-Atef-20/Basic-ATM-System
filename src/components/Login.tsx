import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (identifier: string, password: string) => boolean;
  onSwitchToSignup: () => void;
}

export function Login({ onLogin, onSwitchToSignup }: LoginProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = onLogin(identifier, password);
    if (!success) {
      setError('Invalid username/email or password');
      setPassword('');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <LogIn className="size-5" />
            Login
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enter your credentials to access the bank system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-gray-300">
                Username or Email
              </Label>
              <Input
                id="identifier"
                type="text"
                placeholder="Enter your username or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Login
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
