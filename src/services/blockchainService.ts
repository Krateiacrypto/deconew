import { ethers } from 'ethers';
import { logger } from '../utils/logger';

export const REEF_CHAIN_CONFIG = {
  chainId: '0x3441',
  chainName: 'Reef Chain Mainnet',
  nativeCurrency: {
    name: 'REEF',
    symbol: 'REEF',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.reefscan.com'],
  blockExplorerUrls: ['https://reefscan.com'],
};

export const DCB_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';
export const CO2_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ICO_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
export const STAKING_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
];

const ICO_ABI = [
  'function buyTokens(uint256 amount) payable',
  'function getTokenPrice() view returns (uint256)',
  'function getTotalSold() view returns (uint256)',
  'function getHardCap() view returns (uint256)',
  'function getSoftCap() view returns (uint256)',
  'function isActive() view returns (bool)',
  'function withdraw() returns (bool)',
  'event TokensPurchased(address indexed buyer, uint256 amount, uint256 price)'
];

const STAKING_ABI = [
  'function stake(uint256 poolId, uint256 amount)',
  'function unstake(uint256 positionId)',
  'function claimRewards(uint256 positionId)',
  'function getPoolInfo(uint256 poolId) view returns (tuple(string name, uint256 apy, uint256 lockPeriod, uint256 totalStaked))',
  'function getUserPositions(address user) view returns (uint256[])',
  'function getPositionInfo(uint256 positionId) view returns (tuple(uint256 amount, uint256 startDate, uint256 endDate, uint256 rewards))',
  'event Staked(address indexed user, uint256 indexed poolId, uint256 amount)',
  'event Unstaked(address indexed user, uint256 indexed positionId, uint256 amount)',
  'event RewardsClaimed(address indexed user, uint256 indexed positionId, uint256 amount)'
];

class BlockchainService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  async getProvider(): Promise<ethers.providers.Web3Provider> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not installed');
    }

    if (!this.provider) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum as any);
    }

    return this.provider;
  }

  async getSigner(): Promise<ethers.Signer> {
    const provider = await this.getProvider();

    if (!this.signer) {
      this.signer = provider.getSigner();
    }

    return this.signer;
  }

  async connectWallet(): Promise<string> {
    try {
      const provider = await this.getProvider();
      await provider.send('eth_requestAccounts', []);

      const network = await provider.getNetwork();

      if (network.chainId !== parseInt(REEF_CHAIN_CONFIG.chainId, 16)) {
        await this.switchToReefChain();
      }

      const signer = await this.getSigner();
      const address = await signer.getAddress();

      return address;
    } catch (error) {
      logger.error('Failed to connect wallet', error);
      throw error;
    }
  }

  async switchToReefChain(): Promise<void> {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: REEF_CHAIN_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [REEF_CHAIN_CONFIG],
        });
      } else {
        throw switchError;
      }
    }
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    try {
      const provider = await this.getProvider();
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

      const balance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();

      return ethers.utils.formatUnits(balance, decimals);
    } catch (error) {
      logger.error('Failed to get token balance', error);
      throw error;
    }
  }

  async transferTokens(
    tokenAddress: string,
    toAddress: string,
    amount: string
  ): Promise<ethers.ContractTransaction> {
    try {
      const signer = await this.getSigner();
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

      const decimals = await contract.decimals();
      const amountInWei = ethers.utils.parseUnits(amount, decimals);

      const tx = await contract.transfer(toAddress, amountInWei);
      return tx;
    } catch (error) {
      logger.error('Failed to transfer tokens', error);
      throw error;
    }
  }

  async approveTokens(
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ): Promise<ethers.ContractTransaction> {
    try {
      const signer = await this.getSigner();
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

      const decimals = await contract.decimals();
      const amountInWei = ethers.utils.parseUnits(amount, decimals);

      const tx = await contract.approve(spenderAddress, amountInWei);
      return tx;
    } catch (error) {
      logger.error('Failed to approve tokens', error);
      throw error;
    }
  }

  async buyICOTokens(amount: string): Promise<ethers.ContractTransaction> {
    try {
      const signer = await this.getSigner();
      const contract = new ethers.Contract(ICO_CONTRACT_ADDRESS, ICO_ABI, signer);

      const tokenPrice = await contract.getTokenPrice();
      const totalCost = ethers.BigNumber.from(amount).mul(tokenPrice);

      const tx = await contract.buyTokens(amount, { value: totalCost });
      return tx;
    } catch (error) {
      logger.error('Failed to buy ICO tokens', error);
      throw error;
    }
  }

  async getICOInfo(): Promise<{
    tokenPrice: string;
    totalSold: string;
    hardCap: string;
    softCap: string;
    isActive: boolean;
  }> {
    try {
      const provider = await this.getProvider();
      const contract = new ethers.Contract(ICO_CONTRACT_ADDRESS, ICO_ABI, provider);

      const [tokenPrice, totalSold, hardCap, softCap, isActive] = await Promise.all([
        contract.getTokenPrice(),
        contract.getTotalSold(),
        contract.getHardCap(),
        contract.getSoftCap(),
        contract.isActive()
      ]);

      return {
        tokenPrice: ethers.utils.formatEther(tokenPrice),
        totalSold: ethers.utils.formatEther(totalSold),
        hardCap: ethers.utils.formatEther(hardCap),
        softCap: ethers.utils.formatEther(softCap),
        isActive
      };
    } catch (error) {
      logger.error('Failed to get ICO info', error);
      throw error;
    }
  }

  async stakeTokens(poolId: number, amount: string): Promise<ethers.ContractTransaction> {
    try {
      const signer = await this.getSigner();
      const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);

      const amountInWei = ethers.utils.parseEther(amount);

      await this.approveTokens(DCB_TOKEN_ADDRESS, STAKING_CONTRACT_ADDRESS, amount);

      const tx = await stakingContract.stake(poolId, amountInWei);
      return tx;
    } catch (error) {
      logger.error('Failed to stake tokens', error);
      throw error;
    }
  }

  async unstakeTokens(positionId: number): Promise<ethers.ContractTransaction> {
    try {
      const signer = await this.getSigner();
      const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);

      const tx = await contract.unstake(positionId);
      return tx;
    } catch (error) {
      logger.error('Failed to unstake tokens', error);
      throw error;
    }
  }

  async claimStakingRewards(positionId: number): Promise<ethers.ContractTransaction> {
    try {
      const signer = await this.getSigner();
      const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);

      const tx = await contract.claimRewards(positionId);
      return tx;
    } catch (error) {
      logger.error('Failed to claim rewards', error);
      throw error;
    }
  }

  async getUserStakingPositions(userAddress: string): Promise<any[]> {
    try {
      const provider = await this.getProvider();
      const contract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, provider);

      const positionIds = await contract.getUserPositions(userAddress);

      const positions = await Promise.all(
        positionIds.map(async (id: ethers.BigNumber) => {
          const info = await contract.getPositionInfo(id);
          return {
            id: id.toString(),
            amount: ethers.utils.formatEther(info.amount),
            startDate: new Date(info.startDate.toNumber() * 1000).toISOString(),
            endDate: new Date(info.endDate.toNumber() * 1000).toISOString(),
            rewards: ethers.utils.formatEther(info.rewards)
          };
        })
      );

      return positions;
    } catch (error) {
      logger.error('Failed to get user positions', error);
      throw error;
    }
  }

  async waitForTransaction(tx: ethers.ContractTransaction, confirmations: number = 1): Promise<ethers.ContractReceipt> {
    try {
      const receipt = await tx.wait(confirmations);
      return receipt;
    } catch (error) {
      logger.error('Transaction failed', error);
      throw error;
    }
  }

  subscribeToEvents(
    contractAddress: string,
    abi: any[],
    eventName: string,
    callback: (event: any) => void
  ): void {
    this.getProvider().then(provider => {
      const contract = new ethers.Contract(contractAddress, abi, provider);

      contract.on(eventName, (...args) => {
        const event = args[args.length - 1];
        callback(event);
      });
    });
  }

  unsubscribeFromEvents(contractAddress: string, abi: any[]): void {
    this.getProvider().then(provider => {
      const contract = new ethers.Contract(contractAddress, abi, provider);
      contract.removeAllListeners();
    });
  }
}

export const blockchainService = new BlockchainService();

declare global {
  interface Window {
    ethereum?: any;
  }
}
