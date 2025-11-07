import { supabase } from '../lib/supabase';
import { blockchainService, ICO_CONTRACT_ADDRESS } from './blockchainService';
import toast from 'react-hot-toast';
import { logger } from '../utils/logger';

export interface ICOStats {
  totalSold: string;
  totalRaised: string;
  participants: number;
  tokenPrice: string;
  hardCap: string;
  softCap: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  currentStage: 'presale' | 'public' | 'ended';
  bonusPercentage: number;
}

export interface PurchaseHistory {
  id: string;
  userId: string;
  amount: string;
  tokenAmount: string;
  transactionHash: string;
  status: 'pending' | 'completed' | 'failed';
  purchaseDate: string;
  paymentMethod: 'crypto' | 'fiat';
}

export interface VestingSchedule {
  id: string;
  userId: string;
  totalAmount: string;
  releasedAmount: string;
  remainingAmount: string;
  schedule: {
    date: string;
    amount: string;
    released: boolean;
  }[];
}

class ICOService {
  async getICOStats(): Promise<ICOStats> {
    try {
      const { data: config, error } = await supabase
        .from('ico_config')
        .select('*')
        .single();

      if (error) {
        const blockchainStats = await blockchainService.getICOInfo();

        return {
          totalSold: blockchainStats.totalSold,
          totalRaised: (parseFloat(blockchainStats.totalSold) * parseFloat(blockchainStats.tokenPrice)).toFixed(2),
          participants: 0,
          tokenPrice: blockchainStats.tokenPrice,
          hardCap: blockchainStats.hardCap,
          softCap: blockchainStats.softCap,
          isActive: blockchainStats.isActive,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          currentStage: blockchainStats.isActive ? 'public' : 'ended',
          bonusPercentage: 0
        };
      }

      return {
        totalSold: config.total_sold || '0',
        totalRaised: config.total_raised || '0',
        participants: config.participants || 0,
        tokenPrice: config.token_price || '0.10',
        hardCap: config.hard_cap || '10000000',
        softCap: config.soft_cap || '2000000',
        isActive: config.is_active || false,
        startDate: config.start_date,
        endDate: config.end_date,
        currentStage: config.current_stage || 'public',
        bonusPercentage: config.bonus_percentage || 0
      };
    } catch (error) {
      logger.error('Failed to get ICO stats', error);
      throw error;
    }
  }

  async purchaseTokens(
    userId: string,
    amount: string,
    paymentMethod: 'crypto' | 'fiat'
  ): Promise<PurchaseHistory> {
    try {
      let transactionHash = '';

      if (paymentMethod === 'crypto') {
        const tx = await blockchainService.buyICOTokens(amount);
        transactionHash = tx.hash;

        await blockchainService.waitForTransaction(tx);
      } else {
        throw new Error('Fiat payment method not implemented yet. Please use crypto payment or contact support.');
      }

      const stats = await this.getICOStats();
      const tokenAmount = (parseFloat(amount) / parseFloat(stats.tokenPrice)).toFixed(4);

      const { data, error } = await supabase
        .from('ico_purchases')
        .insert({
          user_id: userId,
          amount,
          token_amount: tokenAmount,
          transaction_hash: transactionHash,
          status: paymentMethod === 'crypto' ? 'completed' : 'pending',
          payment_method: paymentMethod,
          purchase_date: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      await this.updateICOStats(tokenAmount, amount);

      toast.success(`${tokenAmount} DCB token başarıyla satın alındı!`);

      return {
        id: data.id,
        userId: data.user_id,
        amount: data.amount,
        tokenAmount: data.token_amount,
        transactionHash: data.transaction_hash,
        status: data.status,
        purchaseDate: data.purchase_date,
        paymentMethod: data.payment_method
      };
    } catch (error: any) {
      logger.error('Failed to purchase tokens', error);
      toast.error(error.message || 'Token satın alma başarısız!');
      throw error;
    }
  }

  async getPurchaseHistory(userId: string): Promise<PurchaseHistory[]> {
    try {
      const { data, error } = await supabase
        .from('ico_purchases')
        .select('*')
        .eq('user_id', userId)
        .order('purchase_date', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        userId: item.user_id,
        amount: item.amount,
        tokenAmount: item.token_amount,
        transactionHash: item.transaction_hash,
        status: item.status,
        purchaseDate: item.purchase_date,
        paymentMethod: item.payment_method
      }));
    } catch (error) {
      logger.error('Failed to get purchase history', error);
      throw error;
    }
  }

  async createVestingSchedule(
    userId: string,
    totalAmount: string,
    durationMonths: number,
    cliffMonths: number = 0
  ): Promise<VestingSchedule> {
    try {
      const schedule: { date: string; amount: string; released: boolean }[] = [];
      const monthlyAmount = (parseFloat(totalAmount) / durationMonths).toFixed(4);
      const startDate = new Date();

      for (let i = 0; i < durationMonths; i++) {
        const releaseDate = new Date(startDate);
        releaseDate.setMonth(startDate.getMonth() + i + cliffMonths);

        schedule.push({
          date: releaseDate.toISOString(),
          amount: monthlyAmount,
          released: false
        });
      }

      const { data, error } = await supabase
        .from('vesting_schedules')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          released_amount: '0',
          remaining_amount: totalAmount,
          schedule: schedule,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        totalAmount: data.total_amount,
        releasedAmount: data.released_amount,
        remainingAmount: data.remaining_amount,
        schedule: data.schedule
      };
    } catch (error) {
      logger.error('Failed to create vesting schedule', error);
      throw error;
    }
  }

  async getVestingSchedule(userId: string): Promise<VestingSchedule | null> {
    try {
      const { data, error } = await supabase
        .from('vesting_schedules')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return {
        id: data.id,
        userId: data.user_id,
        totalAmount: data.total_amount,
        releasedAmount: data.released_amount,
        remainingAmount: data.remaining_amount,
        schedule: data.schedule
      };
    } catch (error) {
      logger.error('Failed to get vesting schedule', error);
      throw error;
    }
  }

  async releaseVestedTokens(userId: string): Promise<string> {
    try {
      const vesting = await this.getVestingSchedule(userId);
      if (!vesting) throw new Error('No vesting schedule found');

      const now = new Date();
      let releasableAmount = 0;
      const updatedSchedule = vesting.schedule.map(item => {
        if (!item.released && new Date(item.date) <= now) {
          releasableAmount += parseFloat(item.amount);
          return { ...item, released: true };
        }
        return item;
      });

      if (releasableAmount === 0) {
        throw new Error('No tokens available for release');
      }

      const newReleasedAmount = (parseFloat(vesting.releasedAmount) + releasableAmount).toFixed(4);
      const newRemainingAmount = (parseFloat(vesting.remainingAmount) - releasableAmount).toFixed(4);

      const { error } = await supabase
        .from('vesting_schedules')
        .update({
          released_amount: newReleasedAmount,
          remaining_amount: newRemainingAmount,
          schedule: updatedSchedule,
          updated_at: new Date().toISOString()
        })
        .eq('id', vesting.id);

      if (error) throw error;

      toast.success(`${releasableAmount.toFixed(4)} DCB token başarıyla serbest bırakıldı!`);

      return releasableAmount.toFixed(4);
    } catch (error: any) {
      logger.error('Failed to release vested tokens', error);
      toast.error(error.message || 'Token serbest bırakma başarısız!');
      throw error;
    }
  }

  async applyReferralBonus(userId: string, referralCode: string, purchaseAmount: string): Promise<string> {
    try {
      const { data: referrer, error } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', referralCode)
        .eq('is_active', true)
        .single();

      if (error || !referrer) {
        throw new Error('Invalid or inactive referral code');
      }

      const bonusPercentage = 0.05;
      const bonusAmount = (parseFloat(purchaseAmount) * bonusPercentage).toFixed(4);

      await supabase.from('referral_bonuses').insert({
        referrer_id: referrer.user_id,
        referee_id: userId,
        purchase_amount: purchaseAmount,
        bonus_amount: bonusAmount,
        created_at: new Date().toISOString()
      });

      toast.success(`%${bonusPercentage * 100} referans bonusu uygulandı!`);

      return bonusAmount;
    } catch (error: any) {
      logger.error('Failed to apply referral bonus', error);
      return '0';
    }
  }

  private async updateICOStats(tokenAmount: string, fundingAmount: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('ico_config')
        .select('*')
        .single();

      if (error) throw error;

      const newTotalSold = (parseFloat(data.total_sold) + parseFloat(tokenAmount)).toFixed(4);
      const newTotalRaised = (parseFloat(data.total_raised) + parseFloat(fundingAmount)).toFixed(4);
      const newParticipants = data.participants + 1;

      await supabase
        .from('ico_config')
        .update({
          total_sold: newTotalSold,
          total_raised: newTotalRaised,
          participants: newParticipants,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);
    } catch (error) {
      logger.error('Failed to update ICO stats', error);
    }
  }

  async getWhitelistStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('ico_whitelist')
        .select('*')
        .eq('user_id', userId)
        .eq('is_approved', true)
        .single();

      return !error && data !== null;
    } catch (error) {
      return false;
    }
  }

  async addToWhitelist(userId: string, kycLevel: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ico_whitelist')
        .insert({
          user_id: userId,
          kyc_level: kycLevel,
          is_approved: true,
          approved_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('ICO whitelist\'e başarıyla eklend iniz!');
    } catch (error: any) {
      logger.error('Failed to add to whitelist', error);
      toast.error('Whitelist ekleme başarısız!');
      throw error;
    }
  }
}

export const icoService = new ICOService();
