import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { useState } from 'react';

interface UserInfoProps {
  userData: {
    id: string;
    name: string;
    username?: string;
    balance: number;
  };
  onUpdateUser?: (name: string, accountNumber: string) => void;
}

export function UserInfo({ userData, onUpdateUser }: UserInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData.name);
  const [accountNumber, setAccountNumber] = useState(userData.id);

  const handleSave = () => {
    if (onUpdateUser) {
      onUpdateUser(name, accountNumber);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(userData.name);
    setAccountNumber(userData.id);
    setIsEditing(false);
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 11) {
      setAccountNumber(value);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-400 text-sm">Account Holder</Label>
            {isEditing ? (
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            ) : (
              <p className="text-white">{userData.name}</p>
            )}
          </div>
          
          <Separator className="bg-gray-700" />
          
          <div className="space-y-2">
            <Label htmlFor="accountNumber" className="text-gray-400 text-sm">Account Number</Label>
            {isEditing ? (
              <Input
                id="accountNumber"
                value={accountNumber}
                onChange={handleAccountNumberChange}
                className="bg-gray-700 border-gray-600 text-white"
                maxLength={11}
                placeholder="Max 11 digits"
              />
            ) : (
              <p className="text-white">{userData.id}</p>
            )}
          </div>
          
          <Separator className="bg-gray-700" />
          
          {userData.username && (
            <>
              <div className="space-y-2">
                <Label className="text-gray-400 text-sm">Username</Label>
                <p className="text-white">{userData.username}</p>
              </div>
              
              <Separator className="bg-gray-700" />
            </>
          )}
          
          <div className="space-y-2">
            <p className="text-gray-400 text-sm">Current Balance</p>
            <p className="text-green-400">${userData.balance.toFixed(2)}</p>
          </div>

          <div className="pt-4 flex gap-3">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full">
                Edit Information
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}