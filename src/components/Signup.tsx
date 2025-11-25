import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { UserPlus } from 'lucide-react';

interface SignupProps {
  onSignup: (name: string, accountNumber: string, pin: string) => boolean;
  onSwitchToLogin: () => void;
}

export function Signup({ onSignup, onSwitchToLogin }: SignupProps) {
  const [name, setName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
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

  const handleConfirmPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setConfirmPin(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !accountNumber || !pin || !confirmPin) {
      setError('Please fill in all fields');
      return;
    }

    if (accountNumber.length !== 11) {
      setError('Account number must be 11 digits');
      return;
    }

    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    const success = onSignup(name, accountNumber, pin);
    if (!success) {
      setError('Account number already exists');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserPlus className="size-5" />
            Sign Up
          </CardTitle>
          <CardDescription className="text-gray-400">
            Create a new account to use the ATM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-gray-300">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="Create 11-digit account number"
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
                placeholder="Create 4-digit PIN"
                value={pin}
                onChange={handlePinChange}
                className="bg-gray-700 border-gray-600 text-white"
                maxLength={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPin" className="text-gray-300">
                Confirm PIN
              </Label>
              <Input
                id="confirmPin"
                type="password"
                placeholder="Re-enter your PIN"
                value={confirmPin}
                onChange={handleConfirmPinChange}
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
              Sign Up
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
