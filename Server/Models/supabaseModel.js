const supabase = require("../Supabase/supabaseServer");

// Authentication functions
exports.signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

exports.signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

exports.signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

exports.resetPassword = async (email, redirectUrl) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });
  return { data, error };
};

exports.updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
};

exports.getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
};

exports.updateUserMetadata = async (metadata) => {
  const { data, error } = await supabase.auth.updateUser({
    data: metadata
  });
  return { data, error };
};

// User data functions
exports.insertUserData = async (table, userData) => {
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

exports.getUserData = async (table, userId) => {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

exports.updateUserData = async (table, userId, updates) => {
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', userId);
  return { data, error };
};

exports.deleteUserData = async (table, userId) => {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq('id', userId);
  return { data, error };
};

// Google Sign-In
exports.signInWithGoogle = async (redirectUrl) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  });
  return { data, error };
};

// Verify security PIN (for HOD and Admin)
exports.verifySecurityPin = async (role, pin) => {
  // In a real app, you would verify this against a secure backend
  // For now, we'll just simulate a verification
  const { data, error } = await supabase.rpc('verify_security_pin', {
    role_type: role,
    security_pin: pin,
  });
  return { data, error };
};

// Doctor/HOD related functions
exports.getDoctors = async (specialization) => {
  try {
    let query = supabase.from('doctors').select('*').eq('role', 'Doctor');

    if (specialization) {
      query = query.eq('specialization', specialization);
    }
    
    const { data, error } = await query;

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.updateDoctor = async (id, updateData) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .update(updateData)
      .eq('id', id)
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.deleteDoctor = async (id) => {
  try {
    // Step 1: Delete from doctors table first
    const { error: dbError } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id);

    if (dbError) {
      return { error: dbError };
    }

    // Step 2: Delete auth user (using service role key)
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    return { error: authError };
  } catch (error) {
    return { error };
  }
};

exports.getHODs = async (department) => {
  try {
    let query = supabase.from('doctors').select('*').eq('role', 'HOD');

    if (department) {
      query = query.eq('department', department);
    }
    
    const { data, error } = await query;

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.updateHOD = async (id, updateData) => {
  try {
    // First verify this is actually an HOD
    const { data: existingHod, error: fetchError } = await supabase
      .from('doctors')
      .select('role')
      .eq('id', id)
      .single();

    if (fetchError || !existingHod || existingHod.role !== 'HOD') {
      return { data: null, error: fetchError || { message: "HOD not found with this ID" } };
    }

    // Now perform the update
    const { data, error } = await supabase
      .from('doctors')
      .update(updateData)
      .eq('id', id)
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.deleteHOD = async (id) => {
  try {
    // First verify this is actually an HOD
    const { data: existingHod, error: fetchError } = await supabase
      .from('doctors')
      .select('role')
      .eq('id', id)
      .single();

    if (fetchError || !existingHod || existingHod.role !== 'HOD') {
      return { error: fetchError || { message: "HOD not found with this ID" } };
    }

    // Now perform the deletion
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id);

    return { error };
  } catch (error) {
    return { error };
  }
};

// Student related functions
exports.getStudents = async (std) => {
  try {
    let query = supabase.from('students').select('*');

    if (std) {
      query = query.eq('std', std);
    }
    
    const { data, error } = await query;

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.updateStudent = async (id, updateData) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.deleteStudent = async (id) => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    return { error };
  } catch (error) {
    return { error };
  }
};

// Teacher related functions
exports.getTeachers = async (subjectExpertise) => {
  try {
    let query = supabase.from('teachers').select('*');

    if (subjectExpertise) {
      query = query.eq('subject_expertise', subjectExpertise);
    }
    
    const { data, error } = await query;

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.updateTeacher = async (id, updateData) => {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .update(updateData)
      .eq('id', id)
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.deleteTeacher = async (id) => {
  try {
    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id);

    return { error };
  } catch (error) {
    return { error };
  }
};

// Admin related functions
exports.getAdmins = async () => {
  try {
    const { data, error } = await supabase.from('admins').select('*');
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.updateAdmin = async (id, updateData) => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .update(updateData)
      .eq('id', id)
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.deleteAdmin = async (id) => {
  try {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);

    return { error };
  } catch (error) {
    return { error };
  }
};

// Teacher approvals related functions
exports.getTeacherApprovals = async (status) => {
  try {
    let query = supabase.from('teacher_approvals').select('*');

    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.updateTeacherApproval = async (id, updateData) => {
  try {
    const { data, error } = await supabase
      .from('teacher_approvals')
      .update(updateData)
      .eq('id', id)
      .select();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

exports.deleteTeacherApproval = async (id) => {
  try {
    const { error } = await supabase
      .from('teacher_approvals')
      .delete()
      .eq('id', id);

    return { error };
  } catch (error) {
    return { error };
  }
};