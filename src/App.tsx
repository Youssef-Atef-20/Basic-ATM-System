import { useState } from 'react';
import { UserInfo } from './components/UserInfo';
import { Deposit } from './components/Deposit';
import { Withdraw } from './components/Withdraw';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { ManagerDashboard } from './components/ManagerDashboard';
import { ClerkDashboard } from './components/ClerkDashboard';
import { User, CreditCard, DollarSign, LogOut } from 'lucide-react';
import { Button } from './components/ui/button';

type Page = 'userInfo' | 'deposit' | 'withdraw' | 'history';
type AuthPage = 'login' | 'signup';
type AccountType = 'user' | 'clerk' | 'manager';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'account_created' | 'edited_by_manager' | 'edited_by_clerk';
  amount: number;
  date: Date;
  performedBy?: string;
  description?: string;
  targetAccountId?: string;
}

interface UserData {
  id: string;
  name: string;
  username?: string;
  email?: string;
  password: string;
  accountType: AccountType;
  balance: number;
  transactions: Transaction[];
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [currentPage, setCurrentPage] = useState<Page>('userInfo');
  
  // Pre-seed with manager and clerk accounts
  const [accounts, setAccounts] = useState<UserData[]>([
    {
      id: '10000000001',
      name: 'Bank Manager',
      email: 'manager@manager.com',
      password: 'manager@manager.com',
      accountType: 'manager',
      balance: 0,
      transactions: []
    },
    {
      id: '10000000002',
      name: 'Bank Clerk',
      email: 'clerk@clerk.com',
      password: 'clerk@clerk.com',
      accountType: 'clerk',
      balance: 0,
      transactions: []
    }
  ]);
  
  const [userData, setUserData] = useState<UserData | null>(null);

  // Generate unique 11-digit account ID
  const generateAccountId = (): string => {
    let newId: string;
    do {
      newId = Math.floor(10000000000 + Math.random() * 90000000000).toString();
    } while (accounts.some(acc => acc.id === newId));
    return newId;
  };

  // Add transaction to account
  const addTransaction = (accountId: string, transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: new Date()
    };

    setAccounts(prev =>
      prev.map(acc =>
        acc.id === accountId
          ? { ...acc, transactions: [...acc.transactions, newTransaction] }
          : acc
      )
    );

    // Update current user data if it's their transaction
    if (userData && userData.id === accountId) {
      setUserData(prev => prev ? {
        ...prev,
        transactions: [...prev.transactions, newTransaction]
      } : null);
    }
  };

  const handleLogin = (identifier: string, password: string): boolean => {
    // Try to find account by username (for users) or email (for clerk/manager)
    const account = accounts.find(
      acc => (acc.username === identifier || acc.email === identifier) && acc.password === password
    );

    if (account) {
      setUserData(account);
      setIsAuthenticated(true);
      setCurrentPage('userInfo');
      return true;
    }
    return false;
  };

  const handleSignup = (name: string, username: string, password: string): boolean => {
    const usernameExists = accounts.some(acc => acc.username === username);
    
    if (usernameExists) {
      return false;
    }

    const accountId = generateAccountId();
    const newAccount: UserData = {
      id: accountId,
      name,
      username,
      password,
      accountType: 'user',
      balance: 0,
      transactions: [{
        id: Date.now().toString(),
        type: 'account_created',
        amount: 0,
        date: new Date(),
        description: 'Account created successfully'
      }]
    };

    setAccounts(prev => [...prev, newAccount]);
    setUserData(newAccount);
    setIsAuthenticated(true);
    setCurrentPage('userInfo');
    return true;
  };

  const handleLogout = () => {
    // Save current user data back to accounts
    if (userData) {
      setAccounts(prev =>
        prev.map(acc =>
          acc.id === userData.id
            ? { ...acc, name: userData.name, balance: userData.balance, transactions: userData.transactions }
            : acc
        )
      );
    }
    setIsAuthenticated(false);
    setUserData(null);
    setAuthPage('login');
  };

  const handleDeposit = (amount: number, targetAccountId?: string) => {
    const accountId = targetAccountId || userData?.id;
    if (!accountId) return;

    setAccounts(prev =>
      prev.map(acc =>
        acc.id === accountId
          ? { ...acc, balance: acc.balance + amount }
          : acc
      )
    );

    if (userData && userData.id === accountId) {
      setUserData(prev => prev ? ({
        ...prev,
        balance: prev.balance + amount
      }) : null);
    }

    addTransaction(accountId, {
      type: 'deposit',
      amount,
      performedBy: userData?.name,
      description: targetAccountId ? `Deposit by ${userData?.name}` : 'Deposit'
    });
  };

  const handleWithdraw = (amount: number, targetAccountId?: string): boolean => {
    const accountId = targetAccountId || userData?.id;
    if (!accountId) return false;

    const account = accounts.find(acc => acc.id === accountId);
    if (!account || account.balance < amount) {
      return false;
    }

    setAccounts(prev =>
      prev.map(acc =>
        acc.id === accountId
          ? { ...acc, balance: acc.balance - amount }
          : acc
      )
    );

    if (userData && userData.id === accountId) {
      setUserData(prev => prev ? ({
        ...prev,
        balance: prev.balance - amount
      }) : null);
    }

    addTransaction(accountId, {
      type: 'withdraw',
      amount,
      performedBy: userData?.name,
      description: targetAccountId ? `Withdrawal by ${userData?.name}` : 'Withdrawal'
    });

    return true;
  };

  const handleUpdateUser = (name: string, accountNumber: string) => {
    if (userData) {
      setUserData(prev => prev ? ({
        ...prev,
        name,
        id: accountNumber
      }) : null);
    }
  };

  // Manager functions
  const handleCreateAccount = (name: string, username: string, password: string, initialBalance: number): boolean => {
    if (userData?.accountType !== 'manager') return false;

    const usernameExists = accounts.some(acc => acc.username === username);
    if (usernameExists) return false;

    const accountId = generateAccountId();
    const newAccount: UserData = {
      id: accountId,
      name,
      username,
      password,
      accountType: 'user',
      balance: initialBalance,
      transactions: [{
        id: Date.now().toString(),
        type: 'account_created',
        amount: initialBalance,
        date: new Date(),
        performedBy: userData.name,
        description: `Account created by ${userData.name} with initial balance $${initialBalance}`
      }]
    };

    setAccounts(prev => [...prev, newAccount]);
    return true;
  };

  const handleUpdateAccount = (accountId: string, name: string, balance: number) => {
    if (userData?.accountType !== 'manager') return;

    setAccounts(prev =>
      prev.map(acc =>
        acc.id === accountId
          ? { ...acc, name, balance }
          : acc
      )
    );

    addTransaction(accountId, {
      type: 'edited_by_manager',
      amount: 0,
      performedBy: userData.name,
      description: `Account edited by ${userData.name}`
    });
  };

  const handleDeleteAccount = (accountId: string) => {
    if (userData?.accountType !== 'manager') return;
    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md overflow-hidden border-4 border-gray-700">
          {/* Bank Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
            <div className="flex items-center justify-center gap-3">
              <CreditCard className="size-8" />
              <h1>BANK'S SYSTEM</h1>
            </div>
          </div>

          {/* Auth Content */}
          <div className="bg-gray-900 p-6">
            {authPage === 'login' ? (
              <Login
                onLogin={handleLogin}
                onSwitchToSignup={() => setAuthPage('signup')}
              />
            ) : (
              <Signup
                onSignup={handleSignup}
                onSwitchToLogin={() => setAuthPage('login')}
              />
            )}
          </div>

          {/* Bank Footer */}
          <div className="bg-gray-800 p-4 text-center text-gray-400 text-sm">
            <p>Thank you for using our banking service</p>
          </div>
        </div>
      </div>
    );
  }

  // Render Manager Dashboard
  if (userData?.accountType === 'manager') {
    return (
      <ManagerDashboard
        userData={userData}
        allAccounts={accounts}
        onLogout={handleLogout}
        onCreateAccount={handleCreateAccount}
        onUpdateAccount={handleUpdateAccount}
        onDeleteAccount={handleDeleteAccount}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />
    );
  }

  // Render Clerk Dashboard
  if (userData?.accountType === 'clerk') {
    return (
      <ClerkDashboard
        userData={userData}
        allAccounts={accounts}
        onLogout={handleLogout}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />
    );
  }

  // Render regular user interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden border-4 border-gray-700">
        {/* Bank Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="size-8" />
              <h1>BANK'S SYSTEM</h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="bg-gray-800 p-4 grid grid-cols-4 gap-3">
          <Button
            onClick={() => setCurrentPage('userInfo')}
            variant={currentPage === 'userInfo' ? 'default' : 'outline'}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <User className="size-6" />
            <span className="text-xs">User Info</span>
          </Button>
          
          <Button
            onClick={() => setCurrentPage('deposit')}
            variant={currentPage === 'deposit' ? 'default' : 'outline'}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <DollarSign className="size-6" />
            <span className="text-xs">Deposit</span>
          </Button>
          
          <Button
            onClick={() => setCurrentPage('withdraw')}
            variant={currentPage === 'withdraw' ? 'default' : 'outline'}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <CreditCard className="size-6" />
            <span className="text-xs">Withdraw</span>
          </Button>

          <Button
            onClick={() => setCurrentPage('history')}
            variant={currentPage === 'history' ? 'default' : 'outline'}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <User className="size-6" />
            <span className="text-xs">History</span>
          </Button>
        </div>

        {/* Page Content */}
        <div className="bg-gray-900 p-6 min-h-[400px]">
          {userData && (
            <>
              {currentPage === 'userInfo' && <UserInfo userData={userData} onUpdateUser={handleUpdateUser} />}
              {currentPage === 'deposit' && <Deposit onDeposit={handleDeposit} currentBalance={userData.balance} />}
              {currentPage === 'withdraw' && <Withdraw onWithdraw={handleWithdraw} currentBalance={userData.balance} />}
              {currentPage === 'history' && (
                <div className="space-y-4">
                  <h2 className="text-white">Transaction History</h2>
                  {userData.transactions.length === 0 ? (
                    <p className="text-gray-400">No transactions yet</p>
                  ) : (
                    <div className="space-y-3">
                      {[...userData.transactions].reverse().map(transaction => (
                        <div key={transaction.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white capitalize">{transaction.type.replace('_', ' ')}</p>
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
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Bank Footer */}
        <div className="bg-gray-800 p-4 text-center text-gray-400 text-sm">
          <p>Thank you for using our banking service</p>
        </div>
      </div>
    </div>
  );
}
