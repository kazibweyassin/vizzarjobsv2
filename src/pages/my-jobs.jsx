import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { LoadingSpinner } from "@/components/loading";
import { useUser } from "@clerk/clerk-react";

const MyJobs = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingSpinner fullPage={true} text="Loading your jobs..." />;
  }

  return (
    <div className="wellfound-container">
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        {user?.unsafeMetadata?.role === "candidate"
          ? "My Applications"
          : "My Jobs"}
      </h1>
      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  );
};

export default MyJobs;
