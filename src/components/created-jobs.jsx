import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "./job-card";
import EmptyState from "./empty-state";
import { useEffect } from "react";

const CreatedJobs = () => {
  const { user } = useUser();

  const {
    loading: loadingCreatedJobs,
    data: createdJobs,
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnCreatedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {loadingCreatedJobs ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="wellfound-grid mt-8">
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  onJobAction={fnCreatedJobs}
                  isMyJob
                />
              );
            })
          ) : (
            <div className="col-span-full">
              <EmptyState 
                type="my-jobs"
                title="No jobs posted yet"
                description="Start posting job opportunities to attract talented candidates."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatedJobs;
