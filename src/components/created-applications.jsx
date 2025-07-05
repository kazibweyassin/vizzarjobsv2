import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./application-card";
import EmptyState from "./empty-state";
import { LoadingSpinner } from "./loading";
import { useEffect } from "react";
import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";

const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingApplications) {
    return <LoadingSpinner fullPage={false} text="Loading your applications..." />;
  }

  return (
    <div className="space-y-4">
      {applications?.length ? (
        applications.map((application) => {
          return (
            <ApplicationCard
              key={application.id}
              application={application}
              isCandidate={true}
            />
          );
        })
      ) : (
        <EmptyState 
          type="applications"
          title="No applications yet"
          description="You haven't applied to any jobs yet. Start exploring opportunities!"
        />
      )}
    </div>
  );
};

export default CreatedApplications;
