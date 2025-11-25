import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface WithdrawProps {
  onWithdraw: (amount: number) => boolean;
  currentBalance: number;
}

export function Withdraw({ onWithdraw, currentBalance }: WithdrawProps) {
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const quickAmounts = [20, 50, 100, 200];

  const handleWithdraw = (withdrawAmount: number) => {
    if (withdrawAmount > 0) {
      const success = onWithdraw(withdrawAmount);
      if (success) {
        setAmount('');
        setShowSuccess(true);
        setShowError(false);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setShowError(true);
        setShowSuccess(false);
        setTimeout(() => setShowError(false), 3000);
      }
    }
  };

  const handleCustomWithdraw = () => {
    const withdrawAmount = parseFloat(amount);
    if (!isNaN(withdrawAmount) && withdrawAmount > 0) {
      handleWithdraw(withdrawAmount);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Withdraw Money</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Current Balance</p>
            <p className="text-green-400">${currentBalance.toFixed(2)}</p>
          </div>

          {showSuccess && (
            <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 flex items-center gap-3 text-green-400">
              <CheckCircle className="size-5" />
              <p>Withdrawal successful!</p>
            </div>
          )}

          {showError && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-center gap-3 text-red-400">
              <AlertCircle className="size-5" />
              <p>Insufficient funds!</p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-white text-sm">Quick Withdraw</p>
            <div className="grid grid-cols-2 gap-3">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  onClick={() => handleWithdraw(quickAmount)}
                  variant="outline"
                  className="h-16"
                  disabled={currentBalance < quickAmount}
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
              <Button onClick={handleCustomWithdraw} className="px-8">
                Withdraw
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
