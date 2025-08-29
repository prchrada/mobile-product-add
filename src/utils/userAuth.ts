
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  userType: 'buyer' | 'seller';
  avatarUrl?: string;
  // Seller specific fields
  promptPay?: string;
  lineId?: string;
}

let currentUser: UserInfo | null = null;
let currentSession: Session | null = null;

// Initialize auth state
supabase.auth.onAuthStateChange(async (event, session) => {
  currentSession = session;
  if (session?.user) {
    await fetchUserProfile(session.user.id);
  } else {
    currentUser = null;
  }
});

const fetchUserProfile = async (userId: string) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (profile) {
      currentUser = {
        id: profile.user_id,
        name: profile.name,
        phone: profile.phone,
        email: currentSession?.user?.email || '',
        userType: profile.user_type as 'buyer' | 'seller',
        avatarUrl: undefined, // Will be available after avatar_url migration
        promptPay: profile.prompt_pay || undefined,
        lineId: profile.line_id || undefined,
      };
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    currentUser = null;
  }
};

export const signUp = async (email: string, password: string, profileData: Omit<UserInfo, 'id' | 'email'>) => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        name: profileData.name,
        phone: profileData.phone,
        user_type: profileData.userType,
        prompt_pay: profileData.promptPay,
        line_id: profileData.lineId,
        avatar_url: profileData.avatarUrl,
      }
    }
  });

  // If signup successful and user is immediately available, fetch profile
  if (data.user && !error) {
    // Wait a bit for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    await fetchUserProfile(data.user.id);
  }

  return { data, error };
};


export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  currentUser = null;
  currentSession = null;
  return { error };
};

export const getCurrentUser = (): UserInfo | null => {
  return currentUser;
};

export const getCurrentSession = (): Session | null => {
  return currentSession;
};

export const isCurrentUser = (userPhone: string): boolean => {
  return currentUser?.phone === userPhone;
};

export const isSeller = (): boolean => {
  return currentUser?.userType === 'seller';
};

export const isBuyer = (): boolean => {
  return currentUser?.userType === 'buyer';
};

// Initialize session on app start
export const initializeAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  currentSession = session;
  if (session?.user) {
    await fetchUserProfile(session.user.id);
  }
};
