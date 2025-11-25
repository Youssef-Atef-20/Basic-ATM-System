import { useState } from 'react';
import { UserInfo } from './components/UserInfo';
import { Deposit } from './components/Deposit';
import { Withdraw } from './components/Withdraw';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { User, CreditCard, DollarSign, LogOut } from 'lucide-react';
import { Button } from './components/ui/button';

type Page = 'userInfo' | 'deposit' | 'withdraw';
type AuthPage = 'login' | 'signup';

interface UserData {
  name: string;
  accountNumber: string;
  balance: number;
  pin: string;
}

interface StoredAccount {
  name: string;
  accountNumber: string;
  pin: string;
  balance: number;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>('login');
  const [currentPage, setCurrentPage] = useState<Page>('userInfo');
  const [accounts, setAccounts] = useState<StoredAccount[]>([
    {
      name: 'John Doe',
      accountNumber: '12345678910',
      pin: '1234',
      balance: 5000.00
    }
  ]);
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleLogin = (accountNumber: string, pin: string): boolean => {
    const account = accounts.find(
      acc => acc.accountNumber === accountNumber && acc.pin === pin
    );

    if (account) {
      setUserData({
        name: account.name,
        accountNumber: account.accountNumber,
        balance: account.balance,
        pin: account.pin
      });
      setIsAuthenticated(true);
      setCurrentPage('userInfo');
      return true;
    }
    return false;
  };

  const handleSignup = (name: string, accountNumber: string, pin: string): boolean => {
    const accountExists = accounts.some(acc => acc.accountNumber === accountNumber);
    
    if (accountExists) {
      return false;
    }

    const newAccount: StoredAccount = {
      name,
      accountNumber,
      pin,
      balance: 0
    };

    setAccounts(prev => [...prev, newAccount]);
    setUserData({
      name,
      accountNumber,
      balance: 0,
      pin
    });
    setIsAuthenticated(true);
    setCurrentPage('userInfo');
    return true;
  };

  const handleLogout = () => {
    // Save current user data back to accounts
    if (userData) {
      setAccounts(prev =>
        prev.map(acc =>
          acc.accountNumber === userData.accountNumber
            ? { ...acc, name: userData.name, balance: userData.balance }
            : acc
        )
      );
    }
    setIsAuthenticated(false);
    setUserData(null);
    setAuthPage('login');
  };

  const handleDeposit = (amount: number) => {
    if (userData) {
      setUserData(prev => prev ? ({
        ...prev,
        balance: prev.balance + amount
      }) : null);
    }
  };

  const handleWithdraw = (amount: number) => {
    if (userData && userData.balance >= amount) {
      setUserData(prev => prev ? ({
        ...prev,
        balance: prev.balance - amount
      }) : null);
      return true;
    }
    return false;
  };

  const handleUpdateUser = (name: string, accountNumber: string) => {
    if (userData) {
      setUserData(prev => prev ? ({
        ...prev,
        name,
        accountNumber
      }) : null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md overflow-hidden border-4 border-gray-700">
          {/* ATM Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
            <div className="flex items-center justify-center gap-3">
              <CreditCard className="size-8" />
              <h1>ATM SYSTEM</h1>
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

          {/* ATM Footer */}
          <div className="bg-gray-800 p-4 text-center text-gray-400 text-sm">
            <p>Thank you for using our ATM service</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden border-4 border-gray-700">
        {/* ATM Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="size-8" />
              <h1>ATM SYSTEM</h1>
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
        <div className="bg-gray-800 p-4 grid grid-cols-3 gap-3">
          <Button
            onClick={() => setCurrentPage('userInfo')}
            variant={currentPage === 'userInfo' ? 'default' : 'outline'}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <User className="size-6" />
            <span>User Info</span>
          </Button>
          
          <Button
            onClick={() => setCurrentPage('deposit')}
            variant={currentPage === 'deposit' ? 'default' : 'outline'}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <DollarSign className="size-6" />
            <span>Deposit</span>
          </Button>
          
          <Button
            onClick={() => setCurrentPage('withdraw')}
            variant={currentPage === 'withdraw' ? 'default' : 'outline'}
            className="flex flex-col items-center gap-2 h-auto py-4"
          >
            <CreditCard className="size-6" />
            <span>Withdraw</span>
          </Button>
        </div>

        {/* Page Content */}
        <div className="bg-gray-900 p-6 min-h-[400px]">
          {userData && (
            <>
              {currentPage === 'userInfo' && <UserInfo userData={userData} onUpdateUser={handleUpdateUser} />}
              {currentPage === 'deposit' && <Deposit onDeposit={handleDeposit} currentBalance={userData.balance} />}
              {currentPage === 'withdraw' && <Withdraw onWithdraw={handleWithdraw} currentBalance={userData.balance} />}
            </>
          )}
        </div>

        {/* ATM Footer */}
        <div className="bg-gray-800 p-4 text-center text-gray-400 text-sm">
          <p>Thank you for using our ATM service</p>
        </div>
      </div>
    </div>
  );
}