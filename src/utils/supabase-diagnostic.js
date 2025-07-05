import supabaseClient from "@/utils/supabase";

export async function runComprehensiveDiagnostic(token) {
  console.log('\n🔍 STARTING COMPREHENSIVE SUPABASE DIAGNOSTIC');
  console.log('================================================');
  
  const results = {};
  
  // 1. Basic Auth Check
  console.log('\n1️⃣ AUTHENTICATION CHECK');
  console.log('------------------------');
  try {
    const supabase = await supabaseClient(token);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    results.auth = {
      hasToken: !!token,
      tokenLength: token?.length,
      user: user ? {
        id: user.id,
        email: user.email,
        role: user.role,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata
      } : null,
      error: authError
    };
    
    console.log('✅ Token present:', !!token);
    console.log('✅ User authenticated:', !!user);
    console.log('✅ User ID:', user?.id);
    console.log('✅ User email:', user?.email);
    console.log('✅ User role:', user?.role);
    console.log('✅ User metadata:', user?.user_metadata);
    console.log('✅ App metadata:', user?.app_metadata);
    
    if (authError) {
      console.log('❌ Auth error:', authError);
    }
  } catch (error) {
    console.log('❌ Auth check failed:', error);
    results.auth = { error };
  }
  
  // 2. Database Connection Test
  console.log('\n2️⃣ DATABASE CONNECTION TEST');
  console.log('----------------------------');
  try {
    const supabase = await supabaseClient(token);
    
    // Test basic read access
    const { data: readTest, error: readError } = await supabase
      .from("companies")
      .select("id, name")
      .limit(1);
    
    results.database = {
      canRead: !readError,
      readData: readTest,
      readError: readError
    };
    
    console.log('✅ Can read companies:', !readError);
    console.log('✅ Sample data:', readTest);
    
    if (readError) {
      console.log('❌ Read error:', readError);
    }
  } catch (error) {
    console.log('❌ Database connection failed:', error);
    results.database = { error };
  }
  
  // 3. Write Permission Test
  console.log('\n3️⃣ WRITE PERMISSION TEST');
  console.log('-------------------------');
  try {
    const supabase = await supabaseClient(token);
    
    // Try to insert a test record (we'll delete it immediately)
    const testCompany = {
      name: `TEST_COMPANY_${Date.now()}`,
      logo_url: 'https://example.com/test.png'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from("companies")
      .insert([testCompany])
      .select();
    
    results.writeTest = {
      canWrite: !insertError,
      insertData: insertData,
      insertError: insertError
    };
    
    if (!insertError && insertData?.[0]?.id) {
      console.log('✅ Can write to companies table');
      console.log('✅ Test record created:', insertData[0]);
      
      // Clean up - delete the test record
      const { error: deleteError } = await supabase
        .from("companies")
        .delete()
        .eq('id', insertData[0].id);
      
      if (!deleteError) {
        console.log('✅ Test record cleaned up');
      } else {
        console.log('⚠️ Failed to clean up test record:', deleteError);
      }
    } else {
      console.log('❌ Cannot write to companies table');
      console.log('❌ Insert error:', insertError);
    }
  } catch (error) {
    console.log('❌ Write test failed:', error);
    results.writeTest = { error };
  }
  
  // 4. Storage Access Test
  console.log('\n4️⃣ STORAGE ACCESS TEST');
  console.log('----------------------');
  try {
    const supabase = await supabaseClient(token);
    
    // Check if bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    const companyLogoBucket = buckets?.find(bucket => bucket.name === 'company-logo');
    
    results.storage = {
      bucketsAvailable: buckets?.map(b => b.name),
      companyLogoBucketExists: !!companyLogoBucket,
      bucketError: bucketError
    };
    
    console.log('✅ Available buckets:', buckets?.map(b => b.name));
    console.log('✅ Company logo bucket exists:', !!companyLogoBucket);
    
    if (bucketError) {
      console.log('❌ Bucket error:', bucketError);
    }
    
    // Test file upload permission
    if (companyLogoBucket) {
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const testFileName = `test-${Date.now()}.txt`;
      
      const { error: uploadError } = await supabase.storage
        .from("company-logo")
        .upload(testFileName, testBlob);
      
      results.storage.canUpload = !uploadError;
      results.storage.uploadError = uploadError;
      
      if (!uploadError) {
        console.log('✅ Can upload to storage');
        
        // Clean up test file
        await supabase.storage
          .from("company-logo")
          .remove([testFileName]);
        console.log('✅ Test file cleaned up');
      } else {
        console.log('❌ Cannot upload to storage:', uploadError);
      }
    }
  } catch (error) {
    console.log('❌ Storage test failed:', error);
    results.storage = { error };
  }
  
  // 5. RLS Policy Check
  console.log('\n5️⃣ RLS POLICY INFORMATION');
  console.log('--------------------------');
  try {
    const supabase = await supabaseClient(token);
    
    // Try to get information about RLS policies (this might fail in some setups)
    const { data: policies, error: policyError } = await supabase
      .rpc('get_table_policies', { table_name: 'companies' })
      .catch(() => ({ data: null, error: 'RPC not available' }));
    
    results.policies = {
      policies: policies,
      error: policyError
    };
    
    if (policies) {
      console.log('✅ RLS policies found:', policies);
    } else {
      console.log('ℹ️ Could not retrieve RLS policy information');
      console.log('ℹ️ This is normal - check Supabase dashboard for RLS policies');
    }
  } catch (error) {
    console.log('ℹ️ RLS policy check skipped:', error.message);
    results.policies = { error };
  }
  
  // 6. Environment Variables Check
  console.log('\n6️⃣ ENVIRONMENT VARIABLES');
  console.log('-------------------------');
  results.env = {
    hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    anonKeyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length
  };
  
  console.log('✅ Supabase URL present:', !!import.meta.env.VITE_SUPABASE_URL);
  console.log('✅ Anon key present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log('✅ Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('✅ Anon key length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length);
  
  console.log('\n📋 DIAGNOSTIC SUMMARY');
  console.log('=====================');
  console.log('Auth Status:', results.auth?.user ? '✅ Authenticated' : '❌ Not authenticated');
  console.log('Database Read:', results.database?.canRead ? '✅ Working' : '❌ Failed');
  console.log('Database Write:', results.writeTest?.canWrite ? '✅ Working' : '❌ Failed');
  console.log('Storage Access:', results.storage?.companyLogoBucketExists ? '✅ Bucket exists' : '❌ Bucket missing');
  console.log('Storage Upload:', results.storage?.canUpload ? '✅ Working' : '❌ Failed');
  
  return results;
}

// Function to check specific user permissions
export async function checkUserPermissions(token) {
  console.log('\n🔐 USER PERMISSIONS CHECK');
  console.log('=========================');
  
  try {
    const supabase = await supabaseClient(token);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ No authenticated user found');
      return null;
    }
    
    // Check if user has recruiter role or proper permissions
    console.log('User role from metadata:', user.user_metadata?.role);
    console.log('User role from app_metadata:', user.app_metadata?.role);
    
    // Try to check profiles table if it exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .catch(() => ({ data: null, error: 'Profiles table not accessible' }));
    
    if (profile) {
      console.log('User profile:', profile);
    } else {
      console.log('Profile error or not found:', profileError);
    }
    
    return {
      user,
      profile,
      profileError
    };
  } catch (error) {
    console.log('❌ Permission check failed:', error);
    return { error };
  }
}
