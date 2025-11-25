import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CheckCircle } from 'lucide-react';

interface DepositProps {
  onDeposit: (amount: number) => void;
  currentBalance: number;
}

export function Deposit({ onDeposit, currentBalance }: DepositProps) {
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const quickAmounts = [20, 50, 100, 200];

  const handleDeposit = (depositAmount: number) => {
    if (depositAmount > 0) {
      onDeposit(depositAmount);
      setAmount('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCustomDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (!isNaN(depositAmount) && depositAmount > 0) {
      handleDeposit(depositAmount);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Deposit Money</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Current Balance</p>
            <p className="text-green-400">${currentBalance.toFixed(2)}</p>
          </div>

          {showSuccess && (
            <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 flex items-center gap-3 text-green-400">
              <CheckCircle className="size-5" />
              <p>Deposit successful!</p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-white text-sm">Quick Deposit</p>
            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  onClick={() => handleDeposit(quickAmount)}
                  variant="outline"
                  className="h-16"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-white text-sm">Custom Amount</p>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                min="0"
                step="0.01"
              />
              <Button onClick={handleCustomDeposit} className="px-8">
                Deposit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
