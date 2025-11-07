import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  network: string;
  walletType: string | null;
  chainId: number | null;
  
  // Actions
  connectWallet: (type: string) => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (networkName: string) => Promise<void>;
  updateBalance: () => Promise<void>;
  sendTransaction: (to: string, amount: string, tokenType: 'CO2' | 'REEF') => Promise<string>;
}

// ReefChain network configuration
const REEF_CHAIN_CONFIG = {
  chainId: '0x3441', // 13377 in hex
  chainName: 'Reef Chain Mainnet',
  nativeCurrency: {
    name: 'REEF',
    symbol: 'REEF',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.reefscan.com'],
  blockExplorerUrls: ['https://reefscan.com'],
};

// CO₂ Token contract configuration
const CO2_TOKEN_CONFIG = {
  address: '0x1234567890123456789012345678901234567890', // Mock address
  symbol: 'CO₂',
  decimals: 18,
  name: 'DECARBONIZE Carbon Credit Token'
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      address: null,
      balance: '0',
      network: '',
      walletType: null,
      chainId: null,

      connectWallet: async (type: string) => {
        try {
          let provider;
          
          switch (type) {
            case 'metamask':
              if (typeof window.ethereum !== 'undefined') {
                provider = window.ethereum;
              } else {
                throw new Error('MetaMask not installed');
              }
              break;
              
            case 'walletconnect':
              // WalletConnect implementation would go here
              throw new Error('WalletConnect integration coming soon');
              
            case 'reef':
              // Reef Extension implementation would go here
              throw new Error('Reef Extension integration coming soon');
              
            case 'trust':
              // Trust Wallet implementation would go here
              throw new Error('Trust Wallet integration coming soon');
              
            default:
              throw new Error('Unsupported wallet type');
          }

          // Request account access
          const accounts = await provider.request({
            method: 'eth_requestAccounts',
          });

          if (accounts.length === 0) {
            throw new Error('No accounts found');
          }

          const address = accounts[0];
          const chainId = await provider.request({ method: 'eth_chainId' });
          
          // Check if we're on ReefChain, if not, try to switch
          if (chainId !== REEF_CHAIN_CONFIG.chainId) {
            try {
              await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: REEF_CHAIN_CONFIG.chainId }],
              });
            } catch (switchError: any) {
              // If the chain hasn't been added to MetaMask, add it
              if (switchError.code === 4902) {
                await provider.request({
                  method: 'wallet_addEthereumChain',
                  params: [REEF_CHAIN_CONFIG],
                });
              } else {
                throw switchError;
              }
            }
          }

          // Get balance
          const balance = await get().getTokenBalance(address);

          set({
            isConnected: true,
            address,
            balance,
            network: 'ReefChain',
            walletType: type,
            chainId: parseInt(REEF_CHAIN_CONFIG.chainId, 16),
          });

          // Listen for account changes
          provider.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
              get().disconnectWallet();
            } else {
              set({ address: accounts[0] });
              get().updateBalance();
            }
          });

          // Listen for chain changes
          provider.on('chainChanged', (chainId: string) => {
            set({ chainId: parseInt(chainId, 16) });
            if (chainId === REEF_CHAIN_CONFIG.chainId) {
              set({ network: 'ReefChain' });
            } else {
              set({ network: 'Unknown' });
            }
          });

        } catch (error) {
          console.error('Wallet connection failed:', error);
          throw error;
        }
      },

      disconnectWallet: () => {
        set({
          isConnected: false,
          address: null,
          balance: '0',
          network: '',
          walletType: null,
          chainId: null,
        });
      },

      switchNetwork: async (networkName: string) => {
        const { walletType } = get();
        
        if (!walletType || typeof window.ethereum === 'undefined') {
          throw new Error('No wallet connected');
        }

        if (networkName === 'ReefChain') {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: REEF_CHAIN_CONFIG.chainId }],
            });
            set({ network: 'ReefChain' });
          } catch (error: any) {
            if (error.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [REEF_CHAIN_CONFIG],
              });
              set({ network: 'ReefChain' });
            } else {
              throw error;
            }
          }
        }
      },

      updateBalance: async () => {
        const { address } = get();
        if (!address) return;

        try {
          const balance = await get().getTokenBalance(address);
          set({ balance });
        } catch (error) {
          console.error('Failed to update balance:', error);
        }
      },

      getTokenBalance: async (address: string): Promise<string> => {
        // Mock implementation - in real app, this would call the smart contract
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve((Math.random() * 1000).toFixed(4));
          }, 1000);
        });
      },

      sendTransaction: async (to: string, amount: string, tokenType: 'CO2' | 'REEF'): Promise<string> => {
        const { address, walletType } = get();
        
        if (!address || !walletType || typeof window.ethereum === 'undefined') {
          throw new Error('Wallet not connected');
        }

        try {
          let txHash: string;

          if (tokenType === 'CO2') {
            // CO₂ token transfer
            const data = `0xa9059cbb${to.slice(2).padStart(64, '0')}${parseInt(amount).toString(16).padStart(64, '0')}`;
            
            txHash = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [{
                from: address,
                to: CO2_TOKEN_CONFIG.address,
                data,
                gas: '0x5208', // 21000 in hex
              }],
            });
          } else {
            // Native REEF transfer
            txHash = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [{
                from: address,
                to,
                value: `0x${parseInt(amount).toString(16)}`,
                gas: '0x5208',
              }],
            });
          }

          // Update balance after transaction
          setTimeout(() => {
            get().updateBalance();
          }, 2000);

          return txHash;
        } catch (error) {
          console.error('Transaction failed:', error);
          throw error;
        }
      },
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        isConnected: state.isConnected,
        address: state.address,
        walletType: state.walletType,
      }),
    }
  )
);

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (data: any) => void) => void;
      removeListener: (event: string, callback: (data: any) => void) => void;
    };
  }
}