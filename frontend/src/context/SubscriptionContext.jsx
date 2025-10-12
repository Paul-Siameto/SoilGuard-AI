import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState({
    tier: 'free',
    loading: true
  });

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription({ tier: 'free', loading: false });
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_date')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setSubscription({
        tier: data?.subscription_tier || 'free',
        subscriptionDate: data?.subscription_date,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription({ tier: 'free', loading: false });
    }
  };

  const isPro = () => subscription.tier === 'pro';
  const isFree = () => subscription.tier === 'free';

  const refreshSubscription = () => {
    if (user) {
      fetchSubscription();
    }
  };

  const value = {
    ...subscription,
    isPro,
    isFree,
    refreshSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
