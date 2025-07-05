import { lazy } from 'react';

// Lazy load components for better performance
export const LazyLandingPage = lazy(() => import('../pages/landing'));
export const LazyOnboarding = lazy(() => import('../pages/onboarding'));
export const LazyPostJob = lazy(() => import('../pages/post-job'));
export const LazyJobListing = lazy(() => import('../pages/jobListing'));
export const LazyMyJobs = lazy(() => import('../pages/my-jobs'));
export const LazySavedJobs = lazy(() => import('../pages/saved-jobs'));
export const LazyJobPage = lazy(() => import('../pages/job'));
