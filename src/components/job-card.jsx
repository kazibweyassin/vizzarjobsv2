/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon, BriefcaseIcon, CalendarIcon, Building2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { formatDistanceToNow } from "date-fns";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(saveJob);

  const handleSaveJob = async () => {
    await fnSavedJob({
      user_id: user.id,
      job_id: job.id,
    });
    onJobAction();
  };

  const handleDeleteJob = async () => {
    await fnDeleteJob();
    onJobAction();
  };

  useEffect(() => {
    if (savedJob !== undefined) setSaved(savedJob?.length > 0);
  }, [savedJob]);

  // Improved description rendering with fallback and highlight
  const renderDescription = () => {
    if (job.description && typeof job.description === "string") {
      const dotIndex = job.description.indexOf(".");
      if (dotIndex !== -1 && dotIndex < 150) {
        return (
          <span>
            <span className="font-medium">{job.description.substring(0, dotIndex + 1)}</span>
            <span className="text-gray-500">
              {job.description.substring(dotIndex + 1, 150)}
              {job.description.length > 150 && "..."}
            </span>
          </span>
        );
      }
      return job.description.length > 150
        ? job.description.substring(0, 150) + "..."
        : job.description;
    }
    return <span className="text-gray-400">No description available</span>;
  };

  // Job type badges
  const getJobTypeBadge = () => {
    if (!job.job_type) return null;
    
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <BriefcaseIcon size={12} className="mr-1" />
        {job.job_type}
      </Badge>
    );
  };

  return (
    <Card 
      className="wellfound-card wellfound-card-hover fade-in"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {loadingDeleteJob && (
        <div className="absolute inset-x-0 top-0">
          <BarLoader width={"100%"} color="#3b82f6" height={3} />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          {job.company && (
            <div className="flex items-center">
              <div className="h-10 w-10 mr-3 rounded-md overflow-hidden bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center">
                {job.company.logo_url ? (
                  <img
                    src={job.company.logo_url}
                    className="h-full w-full object-contain"
                    alt={job.company.name}
                  />
                ) : (
                  <Building2Icon size={20} className="text-gray-400" />
                )}
              </div>
              <span className="text-sm text-blue-600 font-medium">{job.company.name}</span>
            </div>
          )}
          {isMyJob && (
            <button
              onClick={handleDeleteJob}
              className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
              title="Delete Job"
              disabled={loadingDeleteJob}
            >
              <Trash2Icon size={16} />
            </button>
          )}
        </div>
        
        <CardTitle className="wellfound-heading-lg line-clamp-2">
          {job.title}
        </CardTitle>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {getJobTypeBadge()}
          
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
            <MapPinIcon size={12} className="mr-1" />
            {job.location}
          </Badge>
          
          {job.created_at && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CalendarIcon size={12} className="mr-1" />
              {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="py-3 flex-1">
        <div className="wellfound-text text-sm leading-relaxed">
          {renderDescription()}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-4 border-t border-gray-100">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button 
            variant="secondary" 
            className={`w-full font-medium transition-all ${isHovering ? 'wellfound-primary-button' : 'wellfound-ghost-button'}`}
          >
            View Details
          </Button>
        </Link>
        
        {!isMyJob && (
          <Button
            variant={saved ? "default" : "outline"}
            className={`w-12 p-0 ${saved ? 'bg-red-50 border-red-200' : ''}`}
            onClick={handleSaveJob}
            disabled={loadingSavedJob}
            aria-label={saved ? "Unsave job" : "Save job"}
          >
            {loadingSavedJob ? (
              <BarLoader width={20} height={2} color="#f43f5e" />
            ) : saved ? (
              <Heart size={18} fill="#f43f5e" stroke="#f43f5e" className="text-red-500" />
            ) : (
              <Heart size={18} className="text-gray-500" />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;