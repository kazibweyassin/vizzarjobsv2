/* eslint-disable react/prop-types */
import { Helmet } from 'react-helmet-async';

const SEOMeta = ({
  title = 'VizzarJobs - Find Your Dream Job',
  description = 'Discover thousands of job opportunities or find the perfect candidate. Connect with top companies and talent on VizzarJobs.',
  keywords = 'jobs, career, employment, hiring, recruitment, job search, job portal',
  image = '/logo.png',
  url = window.location.href,
  type = 'website'
}) => {
  const fullTitle = title.includes('VizzarJobs') ? title : `${title} | VizzarJobs`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="VizzarJobs" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="author" content="VizzarJobs" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};

export default SEOMeta;
