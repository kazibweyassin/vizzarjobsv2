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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useFetch from "@/hooks/use-fetch";
import { jobPostSchema } from "@/utils/validation-schemas";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  Briefcase,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  Save,
  Send
} from "lucide-react";

const jobTypes = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" }
];

const experienceLevels = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (2-5 years)" },
  { value: "senior", label: "Senior Level (5+ years)" },
  { value: "executive", label: "Executive Level" }
];

const PostJobNew = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { 
      location: "", 
      company_id: "", 
      requirements: "",
      job_type: "",
      experience_level: "",
      salary_min: "",
      salary_max: "",
      skills: ""
    },
    resolver: zodResolver(jobPostSchema),
    mode: "onChange"
  });

  const watchedValues = watch();

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    fn: fnCreateJob,
  } = useFetch(addNewJob);

  const {
    loading: loadingCompanies,
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  const onSubmit = (data) => {
    const jobData = {
      ...data,
      recruiter_id: user.id,
      isOpen: true,
      skills: data.skills ? data.skills.split(',').map(skill => skill.trim()) : [],
    };
    
    fnCreateJob(jobData);
  };

  const saveDraft = () => {
    const draftData = {
      ...watchedValues,
      saved_at: new Date().toISOString(),
    };
    localStorage.setItem('job_draft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
  };

  const loadDraft = () => {
    const savedDraft = localStorage.getItem('job_draft');
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft);
      Object.keys(draftData).forEach(key => {
        if (key !== 'saved_at') {
          reset({ ...watchedValues, [key]: draftData[key] });
        }
      });
      alert('Draft loaded successfully!');
    }
  };

  useEffect(() => {
    if (dataCreateJob?.length > 0) {
      localStorage.removeItem('job_draft');
      alert('🎉 Job posted successfully!');
      navigate("/jobs");
    }
  }, [dataCreateJob, navigate]);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  useEffect(() => {
    // Check for saved draft on component mount
    const savedDraft = localStorage.getItem('job_draft');
    if (savedDraft) {
      const confirmLoad = window.confirm('Found a saved draft. Would you like to continue from where you left off?');
      if (confirmLoad) {
        loadDraft();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoaded || loadingCompanies) {
    return <LoadingSpinner fullPage={true} text="Loading..." />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  const steps = [
    { id: 1, title: "Basic Info", icon: FileText },
    { id: 2, title: "Details", icon: Briefcase },
    { id: 3, title: "Requirements", icon: Users },
    { id: 4, title: "Review", icon: CheckCircle }
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-4">
      {steps.map((stepItem, index) => {
        const Icon = stepItem.icon;
        const isCompleted = step > stepItem.id;
        const isCurrent = step === stepItem.id;
        
        return (
          <div key={stepItem.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              isCompleted 
                ? 'bg-green-500 border-green-500 text-white' 
                : isCurrent 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'bg-gray-200 border-gray-300 text-gray-500'
            }`}>
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
            }`}>
              {stepItem.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-4 ${
                isCompleted ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <Input
            placeholder="e.g. Senior Frontend Developer"
            {...register("title")}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company *
          </label>
          <div className="flex gap-2">
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={`flex-1 ${errors.company_id ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select company">
                      {field.value
                        ? companies?.find((com) => com.id === Number(field.value))?.name
                        : "Select company"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies?.map(({ name, id }) => (
                        <SelectItem key={name} value={id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            {name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <AddCompanyDrawer fetchCompanies={fnCompanies} />
          </div>
          {errors.company_id && (
            <p className="text-red-500 text-sm mt-1">{errors.company_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={errors.location ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Job Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description *
          </label>
          <Textarea
            placeholder="Describe the role, responsibilities, and what makes this position exciting..."
            {...register("description")}
            className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <Controller
              name="job_type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <Controller
              name="experience_level"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Range (Optional)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Min salary"
                {...register("salary_min")}
                className="pl-10"
                type="number"
              />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Max salary"
                {...register("salary_max")}
                className="pl-10"
                type="number"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills (comma-separated)
          </label>
          <Input
            placeholder="e.g. React, TypeScript, Node.js, AWS"
            {...register("skills")}
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter skills separated by commas
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Requirements & Qualifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Requirements *
          </label>
          <Textarea
            placeholder="• Bachelor's degree in Computer Science or related field&#10;• 3+ years of experience with React&#10;• Strong understanding of JavaScript/TypeScript&#10;• Experience with RESTful APIs&#10;• Excellent communication skills"
            {...register("requirements")}
            className={`min-h-[200px] ${errors.requirements ? "border-red-500" : ""}`}
          />
          {errors.requirements && (
            <p className="text-red-500 text-sm mt-1">{errors.requirements.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            List the required qualifications, skills, and experience needed for this role
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Review Your Job Posting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{watchedValues.title || "Job Title"}</h3>
              <p className="text-gray-600 flex items-center gap-1 mt-1">
                <Building2 className="w-4 h-4" />
                {companies?.find(c => c.id === Number(watchedValues.company_id))?.name || "Company"}
              </p>
              <p className="text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {watchedValues.location || "Location"}
              </p>
            </div>
            {watchedValues.job_type && (
              <Badge variant="secondary">{jobTypes.find(t => t.value === watchedValues.job_type)?.label}</Badge>
            )}
          </div>

          {(watchedValues.salary_min || watchedValues.salary_max) && (
            <div className="flex items-center gap-1 text-green-600 mb-4">
              <DollarSign className="w-4 h-4" />
              <span>
                {watchedValues.salary_min && watchedValues.salary_max 
                  ? `$${watchedValues.salary_min} - $${watchedValues.salary_max}`
                  : watchedValues.salary_min 
                  ? `From $${watchedValues.salary_min}`
                  : `Up to $${watchedValues.salary_max}`
                }
              </span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{watchedValues.description || "No description provided"}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{watchedValues.requirements || "No requirements provided"}</p>
            </div>

            {watchedValues.skills && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {watchedValues.skills.split(',').map((skill, index) => (
                    <Badge key={index} variant="outline">{skill.trim()}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {errorCreateJob && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 text-sm">{errorCreateJob.message}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="wellfound-container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl mb-4">
            Post a New Job
          </h1>
          <p className="text-gray-600 text-lg">
            Find the perfect candidate for your team
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {/* Loading */}
          {loadingCreateJob && (
            <Card className="mt-6">
              <CardContent className="py-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <Send className="w-5 h-5" />
                    <span>Publishing your job posting...</span>
                  </div>
                  <BarLoader width="100%" color="#3b82f6" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={saveDraft}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              {!previewMode && step === 4 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={loadingCreateJob}
                >
                  Previous
                </Button>
              )}
              
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={loadingCreateJob}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loadingCreateJob || !isValid}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loadingCreateJob ? "Publishing..." : "Publish Job"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobNew;
