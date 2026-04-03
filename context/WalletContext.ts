import { createContext, useContext } from 'react';

export interface Transaction {
  id: string;
  dir: 'sent' | 'received';
  name: string;
  amount: number;
  note: string;
  time: string;
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
  userName: string;
  phone: string;
}

export const defaultWalletState: WalletState = {
  balance: 1000,
  userName: 'Euty',
  phone: '+254 712 345 678',
  transactions: [
    { id: '1', dir: 'received', name: 'Alice Wanjiru', amount: 500, note: '', time: 'Today, 08:14' },
    { id: '2', dir: 'sent', name: 'Brian Otieno', amount: 200, note: 'Lunch', time: 'Yesterday, 17:32' },
    { id: '3', dir: 'received', name: 'James Kamau', amount: 150, note: '', time: 'Mon, 12:00' },
  ],
};

export const WalletContext = createContext<{
  wallet: WalletState;
  setWallet: React.Dispatch<React.SetStateAction<WalletState>>;
}>({
  wallet: defaultWalletState,
  setWallet: () => {},
});

export const useWallet = () => useContext(WalletContext);
