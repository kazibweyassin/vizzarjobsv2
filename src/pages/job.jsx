import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  Briefcase,
  DoorClosed,
  DoorOpen,
  MapPinIcon,
  Building2,
  Clock,
  Calendar,
  DollarSign,
  Award,
  ChevronRight,
  Globe,
  CheckCircle,
  Link2,
  Share2,
  Bookmark,
  Users,
  GraduationCap
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const [shareTooltip, setShareTooltip] = useState(false);

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  // Show a loading state
  if (!isLoaded || loadingJob) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md mb-4">
          <BarLoader width={"100%"} color="#36d7b7" />
        </div>
        <p className="text-gray-400 animate-pulse">Loading job details...</p>
      </div>
    );
  }

  // Mock data to enhance the job display
  const jobDetails = {
    ...job,
    salary: job?.salary || "$120,000 - $150,000",
    jobType: job?.jobType || "Full-time",
    experienceLevel: job?.experienceLevel || "Mid-Senior level",
    postedDate: job?.postedDate || "2 weeks ago",
    deadline: job?.deadline || "2023-10-30",
    benefits: job?.benefits || [
      "Health Insurance",
      "401k Matching",
      "Flexible Hours",
      "Remote Work Option",
      "Professional Development"
    ],
    skills: job?.skills || [
      "React",
      "Node.js",
      "TypeScript",
      "GraphQL",
      "AWS"
    ],
    visaSponsorship: job?.visaSponsorship || true,
    relocation: job?.relocation || "Available"
  };

  return (
    <motion.div 
      className="flex flex-col gap-8 mt-5 mb-20"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {/* Header Section */}
      <motion.div variants={fadeIn} className="relative rounded-2xl bg-gradient-to-br from-blue-900 to-gray-900 p-8 shadow-lg">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden rounded-2xl">
          <div className="grid-background"></div>
        </div>
        
        <div className="relative flex flex-col-reverse gap-6 md:flex-row justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {job?.company?.logo_url ? (
                <Avatar className="h-12 w-12 bg-white p-1 rounded-lg">
                  <AvatarImage src={job?.company?.logo_url} alt={job?.company?.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-800 font-bold">
                    {job?.company?.name?.charAt(0) || "C"}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-12 w-12 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-bold text-xl">
                  {job?.company?.name?.charAt(0) || "C"}
                </div>
              )}
              <div>
                <p className="text-gray-300 font-medium">
                  {job?.company?.name || "Company Name"}
                </p>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">{job?.location}</span>
                </div>
              </div>
            </div>

            <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl mt-4 mb-6">
              {job?.title}
            </h1>

            <div className="flex flex-wrap gap-3">
              <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                {jobDetails.jobType}
              </Badge>
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white border-0">
                {jobDetails.experienceLevel}
              </Badge>
              {jobDetails.visaSponsorship && (
                <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">
                  Visa Sponsorship
                </Badge>
              )}
              {jobDetails.relocation && (
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white border-0">
                  Relocation Assistance
                </Badge>
              )}
            </div>
          </div>

          {/* Job status and action buttons */}
          <div className="flex flex-col gap-3">
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
              job?.isOpen ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"
            }`}>
              {job?.isOpen ? (
                <>
                  <DoorOpen className="h-5 w-5" /> 
                  <span>Actively Hiring</span>
                </>
              ) : (
                <>
                  <DoorClosed className="h-5 w-5" /> 
                  <span>Closed</span>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                size="icon" 
                variant="outline" 
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShareTooltip(true);
                  setTimeout(() => setShareTooltip(false), 2000);
                }}
              >
                <Share2 className="h-4 w-4" />
                {shareTooltip && (
                  <div className="absolute bottom-full mb-2 px-2 py-1 text-xs bg-gray-700 rounded">
                    Copied!
                  </div>
                )}
              </Button>
              
              {job?.recruiter_id !== user?.id && (
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Job summary stats */}
      <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-blue-900/30 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Salary Range</p>
              <p className="font-semibold">{jobDetails.salary}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-purple-900/30 p-2 rounded-full">
              <Clock className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Posted</p>
              <p className="font-semibold">{jobDetails.postedDate}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-amber-900/30 p-2 rounded-full">
              <Users className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Applicants</p>
              <p className="font-semibold">{job?.applications?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-green-900/30 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Deadline</p>
              <p className="font-semibold">{jobDetails.deadline}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Change job status (recruiters only) */}
      {job?.recruiter_id === user?.id && (
        <motion.div variants={fadeIn}>
          <Card className="bg-gray-800 border-gray-700 overflow-hidden">
            <CardHeader className="bg-gray-800/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-400" /> 
                Recruiter Controls
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="flex flex-col gap-4">
                <Select onValueChange={handleStatusChange}>
                  <SelectTrigger
                    className={`w-full ${job?.isOpen ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"} border-gray-700`}
                  >
                    <SelectValue
                      placeholder={
                        "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-3 flex-wrap">
                  <Button variant="outline" className="bg-gray-700 border-gray-600 hover:bg-gray-600">
                    Edit Job
                  </Button>
                  <Button variant="outline" className="bg-gray-700 border-gray-600 hover:bg-gray-600">
                    Duplicate Job
                  </Button>
                  <Button variant="destructive">
                    Delete Job
                  </Button>
                </div>
              </div>
              
              {loadingHiringStatus && (
                <div className="mt-4">
                  <BarLoader width={"100%"} color="#36d7b7" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Job descriptions section */}
      <div className="grid md:grid-cols-3 gap-8">
        <motion.div variants={fadeIn} className="md:col-span-2 space-y-8">
          {/* About the job */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="bg-gray-800/50">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-400" />
                About the job
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4">
              <p className="sm:text-lg leading-relaxed">{job?.description}</p>
            </CardContent>
          </Card>

          {/* What we are looking for */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="bg-gray-800/50">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-400" />
                What we are looking for
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="prose prose-invert max-w-none">
                <MDEditor.Markdown
                  source={job?.requirements}
                  className="bg-transparent sm:text-lg wmde-markdown"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar with additional info */}
        <motion.div variants={fadeIn} className="space-y-6">
          {/* Company info */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="bg-gray-800/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-400" /> 
                About the company
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4">
              <p className="text-gray-300 mb-4">
                {job?.company?.description || "A leading company in the tech industry creating innovative solutions."}
              </p>
              
              <div className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <Globe className="h-4 w-4" />
                <a href="#" className="text-sm">Visit company website</a>
              </div>
            </CardContent>
          </Card>
          
          {/* Skills required */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="bg-gray-800/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-400" /> 
                Skills required
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2">
                {jobDetails.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-700 border-gray-600">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Benefits */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="bg-gray-800/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-400" /> 
                Benefits
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {jobDetails.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Apply button for candidates */}
      {job?.recruiter_id !== user?.id && (
        <motion.div 
          variants={fadeIn}
          className="fixed bottom-0 left-0 right-0 z-10 bg-gray-900/80 backdrop-blur-sm p-4 border-t border-gray-700"
        >
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white">{job?.title}</h3>
              <p className="text-gray-300">{job?.company?.name} · {job?.location}</p>
            </div>
            
            <ApplyJobDrawer
              job={job}
              user={user}
              fetchJob={fnJob}
              applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
            />
          </div>
        </motion.div>
      )}

      {/* Applications list for recruiters */}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <motion.div variants={fadeIn} className="mt-8">
          <Card className="bg-gray-800 border-gray-700 overflow-hidden">
            <CardHeader className="bg-gray-800/50">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                Applications ({job?.applications.length})
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4">
              <div className="space-y-4">
                {job?.applications.map((application) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ApplicationCard application={application} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default JobPage;