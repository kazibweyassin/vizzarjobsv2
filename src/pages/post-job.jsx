import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompanyDrawer from "@/components/add-company-drawer";
import { LoadingSpinner } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { jobPostSchema } from "@/utils/validation-schemas";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { location: "", company_id: "", requirements: "" },
    resolver: zodResolver(jobPostSchema),
  });

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const onSubmit = (data) => {
    fnCreateJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) {
      // Show success message and reset form
      console.log("Job posted successfully!");
      reset();
      navigate("/jobs");
    }
  }, [loadingCreateJob, dataCreateJob, navigate, reset]);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <LoadingSpinner fullPage={true} text="Loading companies..." />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div className="wellfound-container">
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto space-y-6 bg-white p-8 rounded-lg shadow-sm border"
        aria-label="Post a new job form"
      >
        <div>
          <Input
            placeholder="Job Title"
            {...register("title")}
            aria-label="Job Title"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <Textarea
            placeholder="Job Description"
            {...register("description")}
            aria-label="Job Description"
            className={errors.description ? "border-red-500" : ""}
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={errors.location ? "border-red-500" : ""}>
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={errors.company_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>
        
        <div className="space-y-1">
          {errors.location && (
            <p className="text-red-500 text-sm" role="alert">
              {errors.location.message}
            </p>
          )}
          {errors.company_id && (
            <p className="text-red-500 text-sm" role="alert">
              {errors.company_id.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Requirements
          </label>
          <Controller
            name="requirements"
            control={control}
            render={({ field }) => (
              <MDEditor 
                value={field.value} 
                onChange={field.onChange}
                className={errors.requirements ? "border-red-500" : ""}
              />
            )}
          />
          {errors.requirements && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.requirements.message}
            </p>
          )}
        </div>
        
        {/* Error Messages */}
        {(errorCreateJob?.message || errors.errorCreateJob) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm" role="alert">
              {errors?.errorCreateJob?.message || errorCreateJob?.message}
            </p>
          </div>
        )}
        
        {/* Loading State */}
        {loadingCreateJob && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Creating job posting...</p>
            <BarLoader width={"100%"} color="#36d7b7" />
          </div>
        )}
        
        <Button 
          type="submit" 
          variant="blue" 
          size="lg" 
          className="mt-2 w-full"
          disabled={loadingCreateJob}
        >
          {loadingCreateJob ? "Creating Job..." : "Post Job"}
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
