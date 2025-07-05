/* eslint-disable react/prop-types */
import { 
  Briefcase, 
  FileText, 
  Users, 
  Search,
  PlusCircle,
  BookmarkCheck
} from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  type = 'jobs', 
  title, 
  description, 
  actionText, 
  actionHref,
  onAction,
  showAction = true 
}) => {
  const configs = {
    jobs: {
      icon: Briefcase,
      title: 'No jobs found',
      description: 'We couldn\'t find any jobs matching your criteria. Try adjusting your filters or search terms.',
      actionText: 'View All Jobs',
      actionHref: '/jobs'
    },
    'saved-jobs': {
      icon: BookmarkCheck,
      title: 'No saved jobs yet',
      description: 'Start saving jobs you\'re interested in to keep track of opportunities.',
      actionText: 'Browse Jobs',
      actionHref: '/jobs'
    },
    applications: {
      icon: FileText,
      title: 'No applications yet',
      description: 'You haven\'t applied to any jobs yet. Start exploring opportunities!',
      actionText: 'Find Jobs',
      actionHref: '/jobs'
    },
    'my-jobs': {
      icon: Users,
      title: 'No jobs posted yet',
      description: 'Start posting job opportunities to attract talented candidates.',
      actionText: 'Post a Job',
      actionHref: '/post-job'
    },
    companies: {
      icon: PlusCircle,
      title: 'No companies found',
      description: 'Add companies to start posting job opportunities.',
      actionText: 'Add Company',
      actionHref: null
    },
    search: {
      icon: Search,
      title: 'No results found',
      description: 'Try different keywords or check your spelling.',
      actionText: 'Clear Filters',
      actionHref: null
    }
  };

  const config = configs[type] || configs.jobs;
  const IconComponent = config.icon;

  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalActionText = actionText || config.actionText;
  const finalActionHref = actionHref !== undefined ? actionHref : config.actionHref;

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
        <IconComponent className="h-8 w-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {finalTitle}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {finalDescription}
      </p>
      
      {showAction && (finalActionHref || onAction) && (
        <div className="space-y-3">
          {finalActionHref ? (
            <Link to={finalActionHref}>
              <Button className="wellfound-primary-button">
                {finalActionText}
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={handleAction}
              className="wellfound-primary-button"
            >
              {finalActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
