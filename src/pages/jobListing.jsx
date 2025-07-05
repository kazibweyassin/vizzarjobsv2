import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners"; 


import JobCard from "@/components/job-card";
import EmptyState from "@/components/empty-state";
import { LoadingSpinner, LoadingGrid } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";

import { Search, MapPin, Building2, X, Filter } from "lucide-react";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { isLoaded } = useUser();

  const { data: companies, fn: fnCompanies } = useFetch(getCompanies);
  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, fnJobs, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search-query");
    setSearchQuery(query || "");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCompany_id("");
    setLocation("");
  };

  const hasActiveFilters = searchQuery || location || company_id;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <BarLoader width={100} color="#2563eb" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 border-b shadow-sm sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">
              Find Your Next Job
            </h1>
            <p className="text-gray-600 text-lg">
              {loadingJobs
                ? "Loading jobs..."
                : `Discover ${jobs?.length || 0} opportunities`}
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2 md:hidden"
            onClick={() => setShowFilters((v) => !v)}
          >
            <Filter size={18} />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4 items-stretch mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search jobs, titles, or keywords..."
              name="search-query"
              defaultValue={searchQuery}
              className="pl-10 h-12 rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-200"
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            className="h-12 px-6 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow"
          >
            Search
          </Button>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              onClick={clearFilters}
              className="h-12 px-4 rounded-xl text-blue-600 flex items-center gap-2"
            >
              <X className="h-5 w-5" />
              Clear
            </Button>
          )}
        </form>

        {/* Filters */}
        <div
          className={`transition-all duration-300 ${
            showFilters ? "block" : "hidden md:grid"
          } grid-cols-1 md:grid-cols-3 gap-4 mb-8`}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="inline mr-1 text-blue-500" size={16} />
              Location
            </label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Any location" />
              </SelectTrigger>
              <SelectContent>
                {State.getStatesOfCountry("IN").map(({ name }) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Building2 className="inline mr-1 text-blue-500" size={16} />
              Company
            </label>
            <Select value={company_id} onValueChange={setCompany_id}>
              <SelectTrigger>
                <SelectValue placeholder="Any company" />
              </SelectTrigger>
              <SelectContent>
                {companies?.map(({ name, id }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {loadingJobs ? "Loading..." : `${jobs?.length || 0} Jobs Found`}
          </h2>
          <span className="text-gray-500 text-sm hidden md:inline">
            {hasActiveFilters
              ? "Filters applied"
              : "Showing all jobs"}
          </span>
        </div>

        {/* Loading */}
        {loadingJobs && (
          <div className="flex justify-center py-16">
            <BarLoader width={120} color="#2563eb" />
          </div>
        )}

        {/* Jobs Grid */}
        {!loadingJobs && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs?.length ? (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500 text-lg mb-4">No jobs found</p>
                {hasActiveFilters && (
                  <Button onClick={clearFilters} variant="outline">
                    Clear filters to see all jobs
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListing;