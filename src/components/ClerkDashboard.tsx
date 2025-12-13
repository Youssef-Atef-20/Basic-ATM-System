import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { CreditCard, LogOut, Users, History, DollarSign } from 'lucide-react';

type Page = 'accounts' | 'transactions';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: Date;
  performedBy?: string;
  description?: string;
}

interface UserData {
  id: string;
  name: string;
  username?: string;
  email?: string;
  password: string;
  accountType: 'user' | 'clerk' | 'manager';
  balance: number;
  transactions: Transaction[];
}

interface ClerkDashboardProps {
  userData: UserData;
  allAccounts: UserData[];
  onLogout: () => void;
  onDeposit: (amount: number, targetAccountId?: string) => void;
  onWithdraw: (amount: number, targetAccountId?: string) => boolean;
}

export function ClerkDashboard({
  userData,
  allAccounts,
  onLogout,
  onDeposit,
  onWithdraw
}: ClerkDashboardProps) {
  const [currentPage, setCurrentPage] = useState<Page>('accounts');
  const [selectedAccount, setSelectedAccount] = useState<UserData | null>(null);

  // Transaction form
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const [transactionSuccess, setTransactionSuccess] = useState('');

  const handleDeposit = () => {
    setTransactionError('');
    setTransactionSuccess('');
    
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      setTransactionError('Please enter a valid amount');
      return;
    }

    if (selectedAccount) {
      onDeposit(amount, selectedAccount.id);
      setTransactionSuccess(`Successfully deposited $${amount.toFixed(2)}`);
      setTransactionAmount('');
      setTimeout(() => setTransactionSuccess(''), 3000);
    }
  };

  const handleWithdraw = () => {
    setTransactionError('');
    setTransactionSuccess('');
    
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      setTransactionError('Please enter a valid amount');
      return;
    }

    if (selectedAccount) {
      const success = onWithdraw(amount, selectedAccount.id);
      if (success) {
        setTransactionSuccess(`Successfully withdrew $${amount.toFixed(2)}`);
        setTransactionAmount('');
        setTimeout(() => setTransactionSuccess(''), 3000);
      } else {
        setTransactionError('Insufficient balance');
      }
    }
  };

  const userAccounts = allAccounts.filter(acc => acc.accountType === 'user');
  const allTransactions = allAccounts.flatMap(acc => 
    acc.transactions.map(t => ({ ...t, accountId: acc.id, accountName: acc.name }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-900 rounded-lg shadow-2xl border-4 border-gray-700 mb-4">
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="size-8" />
                <div>
                  <h1>BANK'S SYSTEM - Clerk</h1>
                  <p className="text-sm opacity-90">Welcome, {userData.name}</p>
                </div>
              </div>
              <Button
                onClick={onLogout}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-800 p-4 grid grid-cols-2 gap-3">
            <Button
              onClick={() => setCurrentPage('accounts')}
              variant={currentPage === 'accounts' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Users className="size-5" />
              All Accounts
            </Button>
            <Button
              onClick={() => setCurrentPage('transactions')}
              variant={currentPage === 'transactions' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <History className="size-5" />
              All Transactions
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-lg shadow-2xl border-4 border-gray-700 p-6">
            {currentPage === 'accounts' && (
              <div className="space-y-4">
                <h2 className="text-white">All User Accounts</h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {userAccounts.map(account => (
                    <div
                      key={account.id}
                      onClick={() => {
                        setSelectedAccount(account);
                        setTransactionError('');
                        setTransactionSuccess('');
                      }}
                      className={`bg-gray-800 border-2 ${selectedAccount?.id === account.id ? 'border-teal-500' : 'border-gray-700'} rounded-lg p-4 cursor-pointer hover:border-teal-400 transition-colors`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white">{account.name}</p>
                          <p className="text-gray-400 text-sm">ID: {account.id}</p>
                          <p className="text-gray-400 text-sm">Username: {account.username}</p>
                        </div>
                        <p className="text-green-400">${account.balance.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentPage === 'transactions' && (
              <div className="space-y-4">
                <h2 className="text-white">All Transactions</h2>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {allTransactions.map(transaction => (
                    <div key={transaction.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white capitalize">{transaction.type.replace('_', ' ')}</p>
                          <p className="text-gray-400 text-sm">{transaction.accountName} (ID: {transaction.accountId})</p>
                          <p className="text-gray-400 text-sm">{transaction.description}</p>
                          <p className="text-gray-500 text-xs mt-1">{new Date(transaction.date).toLocaleString()}</p>
                        </div>
                        <p className={`${transaction.type === 'deposit' ? 'text-green-400' : transaction.type === 'withdraw' ? 'text-red-400' : 'text-gray-400'}`}>
                          {transaction.type === 'deposit' ? '+' : transaction.type === 'withdraw' ? '-' : ''}${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Account Details Panel */}
          <div className="bg-gray-900 rounded-lg shadow-2xl border-4 border-gray-700 p-6">
            {selectedAccount ? (
              <div className="space-y-4">
                <h2 className="text-white">Account Details</h2>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-400 text-sm">Account Holder</Label>
                      <p className="text-white">{selectedAccount.name}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400 text-sm">Account ID</Label>
                      <p className="text-white">{selectedAccount.id}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400 text-sm">Username</Label>
                      <p className="text-white">{selectedAccount.username}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400 text-sm">Balance</Label>
                      <p className="text-green-400">${selectedAccount.balance.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction Section */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <DollarSign className="size-5" />
                      Manage Transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    {transactionError && (
                      <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 text-red-400 text-sm">
                        {transactionError}
                      </div>
                    )}

                    {transactionSuccess && (
                      <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 text-green-400 text-sm">
                        {transactionSuccess}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={handleDeposit} className="flex-1">
                        Deposit
                      </Button>
                      <Button onClick={handleWithdraw} variant="outline" className="flex-1">
                        Withdraw
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction History */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {selectedAccount.transactions.length === 0 ? (
                        <p className="text-gray-400">No transactions</p>
                      ) : (
                        [...selectedAccount.transactions].reverse().map(transaction => (
                          <div key={transaction.id} className="bg-gray-700 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white text-sm capitalize">{transaction.type.replace('_', ' ')}</p>
                                <p className="text-gray-400 text-xs">{transaction.description}</p>
                                <p className="text-gray-500 text-xs">{new Date(transaction.date).toLocaleString()}</p>
                              </div>
                              <p className={`text-sm ${transaction.type === 'deposit' ? 'text-green-400' : transaction.type === 'withdraw' ? 'text-red-400' : 'text-gray-400'}`}>
                                {transaction.type === 'deposit' ? '+' : transaction.type === 'withdraw' ? '-' : ''}${transaction.amount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Select an account to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
