
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
      .select('id, user_id, name, phone, user_type, prompt_pay, line_id')
      .eq('user_id', userId)
      .single();
    
    if (profile) {
      currentUser = {
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        email: currentSession?.user?.email || '',
        userType: profile.user_type as 'buyer' | 'seller',
        avatarUrl: undefined, // Will be available after migration
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
      emailRedirectTo: redirectUrl
    }
  });

  if (error) return { error };

  // Create profile after successful signup
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: data.user.id,
        name: profileData.name,
        phone: profileData.phone,
        user_type: profileData.userType,
        prompt_pay: profileData.promptPay,
        line_id: profileData.lineId,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return { error: profileError };
    }
  }

  return { data, error: null };
};

export const signInWithNameAndPhone = async (name: string, phone: string) => {
  try {
    // Find user by name and phone
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('user_id, name, phone, user_type, prompt_pay, line_id')
      .eq('name', name)
      .eq('phone', phone)
      .single();

    if (error || !profile) {
      return { error: { message: 'ไม่พบผู้ใช้ที่ตรงกับชื่อและเบอร์โทรที่ระบุ' } };
    }

    // Set current user manually since we're doing a quick login
    currentUser = {
      id: profile.user_id,
      name: profile.name,
      phone: profile.phone,
      email: '', // We'll set this later when needed
      userType: profile.user_type as 'buyer' | 'seller',
      avatarUrl: undefined, // Will be available after migration
      promptPay: profile.prompt_pay || undefined,
      lineId: profile.line_id || undefined,
    };

    return { data: profile, error: null };
  } catch (error) {
    console.error('Error signing in with name and phone:', error);
    return { error: { message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' } };
  }
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
