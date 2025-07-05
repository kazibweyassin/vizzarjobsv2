/* eslint-disable react/prop-types */
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { runComprehensiveDiagnostic, checkUserPermissions } from "@/utils/supabase-diagnostic";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";
import { useUser, useSession } from "@clerk/clerk-react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only Images are allowed",
      }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const { user } = useUser();
  const { session } = useSession();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = async (data) => {
    console.log('=== COMPANY SUBMISSION DEBUG ===');
    console.log('User:', user);
    console.log('User role:', user?.unsafeMetadata?.role);
    console.log('User ID:', user?.id);
    console.log('Submitting company:', data.name);
    
    // Check if user is a recruiter
    if (user?.unsafeMetadata?.role !== 'recruiter') {
      alert('Only recruiters can add companies. Please ensure your account has the correct role.');
      return;
    }
    
    // Debug authentication first
    try {
      // Get token using proper Clerk session method
      const token = await session?.getToken({
        template: "supabase",
      });
      
      console.log('Token obtained:', !!token);
      if (token) {
        console.log('Token preview:', token.substring(0, 20) + '...');
      } else {
        console.error('Failed to obtain token');
        alert('Failed to get authentication token. Please try signing out and back in.');
        return;
      }
      
      // Run comprehensive diagnostic
      console.log('🔍 Running comprehensive diagnostic...');
      const diagnostic = await runComprehensiveDiagnostic(token);
      const permissions = await checkUserPermissions(token);
      
      console.log('📊 Diagnostic results:', diagnostic);
      console.log('🔐 Permission check:', permissions);
      
      // Check authentication
      if (!diagnostic.auth?.user) {
        alert('Authentication failed: Please log in again.');
        return;
      }
      
      // Check database connection
      if (!diagnostic.database?.canRead) {
        alert('Database connection failed: Please check your connection and try again.');
        return;
      }
      
      // Check write permissions
      if (!diagnostic.writeTest?.canWrite) {
        const errorMsg = diagnostic.writeTest?.insertError?.message || 'Unknown error';
        if (diagnostic.writeTest?.insertError?.code === '42501') {
          alert('Permission denied: Your account doesn\'t have permission to add companies. Please contact an administrator to verify your recruiter role is properly configured.');
        } else {
          alert(`Database write error: ${errorMsg}`);
        }
        return;
      }
      
      // Check storage access
      if (!diagnostic.storage?.companyLogoBucketExists) {
        alert('Storage error: Company logo bucket not found. Please contact an administrator.');
        return;
      }
      
      if (!diagnostic.storage?.canUpload) {
        alert(`Storage upload error: ${diagnostic.storage?.uploadError?.message || 'Cannot upload files'}`);
        return;
      }
      
      console.log('✅ All diagnostic checks passed, proceeding with company creation...');
      
      // Proceed with company creation
      fnAddCompany({
        ...data,
        logo: data.logo[0],
      });
      
    } catch (err) {
      console.error('Token error:', err);
      alert('Failed to get authentication token. Please try signing out and back in.');
    }
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      console.log('Company created successfully, refreshing list...');
      fetchCompanies();
      reset(); // Clear the form
    }
  }, [dataAddCompany, fetchCompanies, reset]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>
        <form className="flex gap-2 p-4 pb-0">
          {/* Company Name */}
          <Input placeholder="Company name" {...register("name")} />

          {/* Company Logo */}
          <Input
            type="file"
            accept="image/*"
            className=" file:text-gray-500"
            {...register("logo")}
          />

          {/* Test Connection Button */}
          <Button
            type="button"
            onClick={async () => {
              try {
                const token = await session?.getToken({
                  template: "supabase",
                });
                
                if (!token) {
                  alert('Failed to get authentication token');
                  return;
                }
                
                const diagnostic = await runComprehensiveDiagnostic(token);
                console.log('Test result:', diagnostic);
                
                if (diagnostic.auth?.user && diagnostic.database?.canRead) {
                  alert('Connection test successful! ✅');
                } else {
                  alert(`Connection test failed: ${diagnostic.database?.readError?.message || 'Unknown error'}`);
                }
              } catch (error) {
                console.error('Test connection error:', error);
                alert(`Test failed: ${error.message}`);
              }
            }}
            variant="outline"
            className="w-32"
          >
            Test
          </Button>

          {/* Add Button */}
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-40"
          >
            Add
          </Button>
        </form>
        <DrawerFooter>
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
          {errorAddCompany?.message && (
            <p className="text-red-500">{errorAddCompany?.message}</p>
          )}
          {loadingAddCompany && <BarLoader width={"100%"} color="#36d7b7" />}
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
