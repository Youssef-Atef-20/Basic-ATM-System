import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (accountNumber: string, pin: string) => boolean;
  onSwitchToSignup: () => void;
}

export function Login({ onLogin, onSwitchToSignup }: LoginProps) {
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setAccountNumber(value);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setPin(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accountNumber || !pin) {
      setError('Please fill in all fields');
      return;
    }

    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    const success = onLogin(accountNumber, pin);
    if (!success) {
      setError('Invalid account number or PIN');
      setPin('');
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
            Enter your account details to access the ATM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-gray-300">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="Enter 11-digit account number"
                value={accountNumber}
                onChange={handleAccountNumberChange}
                className="bg-gray-700 border-gray-600 text-white"
                maxLength={11}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="text-gray-300">
                PIN
              </Label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={handlePinChange}
                className="bg-gray-700 border-gray-600 text-white"
                maxLength={4}
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
