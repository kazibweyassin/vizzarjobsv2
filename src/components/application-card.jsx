/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  return (
    <Card className="wellfound-card">
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="wellfound-heading flex justify-between">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2 items-center wellfound-text">
            <BriefcaseBusiness size={15} /> {application?.experience} years of
            experience
          </div>
          <div className="flex gap-2 items-center wellfound-text">
            <School size={15} />
            {application?.education}
          </div>
          <div className="flex gap-2 items-center wellfound-text">
            <Boxes size={15} /> Skills: {application?.skills}
          </div>
        </div>
        <hr className="border-gray-100" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className="capitalize font-bold">
            Status: {application.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
