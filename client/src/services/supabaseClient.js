import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset-password',
  });
  return { data, error };
};

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};

// Check if email already exists in any role table
export const checkEmailExists = async (email) => {
  const tables = ['student', 'teacher', 'hod', 'admin'];
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('email')
      .eq('email', email)
      .single();
    
    if (data) {
      // Email found in this table
      return { exists: true, role: table };
    }
  }
  
  // Email not found in any table
  return { exists: false, role: null };
};

// User data functions
export const insertUserData = async (table, userData) => {
  try {
    console.log(`Inserting data into table: ${table}`, userData);
    const { data, error } = await supabase.from(table).insert([userData]).select();
    
    if (error) {
      console.error(`Error inserting data into ${table}:`, error);
      // Add more details to the error object to make it more informative
      error.details = {
        table,
        message: error.message || 'Unknown database error',
        code: error.code,
        hint: error.hint || 'Check if the table exists and all required fields are provided'
      };
    } else {
      console.log(`Successfully inserted data into ${table}:`, data);
    }
    
    return { data, error };
  } catch (err) {
    console.error(`Exception when inserting data into ${table}:`, err);
    // Make the error more descriptive
    const enhancedError = {
      message: err.message || 'Unknown error occurred',
      details: {
        table,
        originalError: err.toString()
      }
    };
    return { data: null, error: enhancedError };
  }
};

export const getUserData = async (table, userId) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// Function to check user role from all role-based tables
export const checkUserRole = async (userId) => {
  // Check each table to find the user's role
  const tables = ['student', 'teacher', 'hod', 'admin'];
  let userRole = null;
  let userData = null;
  let foundRoles = [];
  let allRolesData = {};
  
  // Check all tables to find if user exists in multiple roles
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data && !error) {
      foundRoles.push(table);
      allRolesData[table] = data;
    }
  }
  
  // If user has multiple roles, return with multipleRoles flag
  if (foundRoles.length > 1) {
    return { 
      userRole: null, 
      userData: null, 
      multipleRoles: true, 
      availableRoles: foundRoles,
      allRolesData: allRolesData
    };
  } 
  // If user has exactly one role, return that role
  else if (foundRoles.length === 1) {
    userRole = foundRoles[0];
    userData = allRolesData[userRole];
    return { userRole, userData, multipleRoles: false };
  }
  // If no roles found
  else {
    return { userRole: null, userData: null, multipleRoles: false };
  }
};

export const updateUserData = async (table, userId, updates) => {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', userId);
  return { data, error };
};

// Google Sign-In
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/profile-completion',
    },
  });
  return { data, error };
};

// Verify security PIN (for HOD and Admin)
export const verifySecurityPin = async (role, pin) => {
  try {
    // Get the correct PIN from environment variables
    let correctPin;
    
    if (role === 'hod') {
      correctPin = import.meta.env.VITE_HOD_SECURITY_PIN;
    } else if (role === 'admin') {
      correctPin = import.meta.env.VITE_ADMIN_SECURITY_PIN;
    } else {
      return { data: { verified: false }, error: { message: 'Invalid role type' } };
    }
    
    // Verify the PIN
    const verified = pin === correctPin;
    
    return { 
      data: { verified }, 
      error: verified ? null : { message: 'Invalid security PIN' }
    };
  } catch (err) {
    console.error('Error verifying security PIN:', err);
    return { data: null, error: { message: 'Error verifying PIN' } };
  }
};