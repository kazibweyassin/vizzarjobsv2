import supabaseClient, { supabaseUrl } from "@/utils/supabase";
import { createClient } from "@supabase/supabase-js";

// Debug function to check authentication
export async function debugAuth(token) {
  console.log('=== DEBUGGING AUTHENTICATION ===');
  console.log('Token provided:', !!token);
  console.log('Token length:', token?.length);
  
  const supabase = await supabaseClient(token);
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('Current user:', user);
    console.log('Auth error:', error);
    
    // Test basic read access
    const { data: testData, error: testError } = await supabase
      .from("companies")
      .select("id, name")
      .limit(1);
    
    console.log('Test read result:', testData);
    console.log('Test read error:', testError);
    
    return { user, testData, testError };
  } catch (err) {
    console.error('Debug auth error:', err);
    return { error: err };
  }
}

// Fetch Companies
export async function getCompanies(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching Companies:", error);
    return null;
  }

  return data;
}

// Add Company
export async function addNewCompany(token, _, companyData) {
  console.log('Starting company creation...');
  console.log('Token provided:', !!token);
  console.log('Company data:', { name: companyData.name, logoType: companyData.logo?.type });
  
  // First try: Use authenticated client for both storage and database
  let supabase = await supabaseClient(token);
  
  const random = Math.floor(Math.random() * 90000);
  const fileExtension = companyData.logo.name.split('.').pop();
  const fileName = `logo-${random}.${fileExtension}`;

  console.log('Uploading file:', fileName);
  console.log('File type:', companyData.logo.type);
  console.log('File size:', companyData.logo.size);

  let { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo, {
      cacheControl: '3600',
      upsert: false,
      contentType: companyData.logo.type
    });

  // If authenticated upload fails, try anonymous upload as fallback
  if (storageError && storageError.message.includes('signature')) {
    console.log('Authenticated upload failed, trying anonymous upload...');
    const anonSupabase = createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    const result = await anonSupabase.storage
      .from("company-logo")
      .upload(fileName, companyData.logo, {
        cacheControl: '3600',
        upsert: false,
        contentType: companyData.logo.type
      });
    
    storageError = result.error;
  }

  if (storageError) {
    console.error("Storage Error Details:", storageError);
    throw new Error(`Error uploading Company Logo: ${storageError.message}`);
  }

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;
  console.log('File uploaded successfully, URL:', logo_url);

  // Always use authenticated client for database operations
  console.log('Attempting to insert company into database...');
  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url: logo_url,
      },
    ])
    .select();

  if (error) {
    console.error("Database Error Details:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error details:", error.details);
    console.error("Error hint:", error.hint);
    
    // More specific error handling
    if (error.code === '42501' || error.message.includes('permission denied')) {
      throw new Error("Permission denied: You don't have permission to create companies. Please contact an administrator.");
    } else if (error.code === '23505') {
      throw new Error("A company with this name already exists.");
    } else {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  console.log('Company created successfully:', data);
  return data;
}

// Test function to check if storage bucket is properly configured
export async function testStorageBucket() {
  const supabase = createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_ANON_KEY);
  
  try {
    // List buckets to see if company-logo exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    console.log('Available buckets:', buckets);
    
    if (bucketError) {
      console.error('Bucket list error:', bucketError);
      return false;
    }
    
    const companyLogoBucket = buckets?.find(bucket => bucket.name === 'company-logo');
    if (!companyLogoBucket) {
      console.error('company-logo bucket not found');
      return false;
    }
    
    console.log('company-logo bucket found:', companyLogoBucket);
    return true;
  } catch (error) {
    console.error('Storage test error:', error);
    return false;
  }
}
