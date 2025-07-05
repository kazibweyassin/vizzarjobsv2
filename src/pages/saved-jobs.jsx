import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/job-card";
import EmptyState from "@/components/empty-state";
import { LoadingSpinner } from "@/components/loading";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    data: savedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) {
      fnSavedJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <LoadingSpinner fullPage={true} text="Loading your saved jobs..." />;
  }

  return (
    <div className="wellfound-container">
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {loadingSavedJobs === false && (
        <div className="wellfound-grid">
          {savedJobs?.length ? (
            savedJobs?.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  onJobAction={fnSavedJobs}
                  savedInit={true}
                />
              );
            })
          ) : (
            <EmptyState 
              type="saved-jobs"
              title="No saved jobs yet"
              description="Start saving jobs you're interested in to keep track of opportunities."
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
