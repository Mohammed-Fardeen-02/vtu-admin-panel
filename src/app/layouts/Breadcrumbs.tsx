import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const routeNames: Record<string, string> = {
    academics: 'Academics',
    hierarchy: 'Academic Hierarchy',
    'course-structure': 'Course Structure',
    branches: 'Branches',
    schemes: 'Schemes',
    syllabus: 'Syllabus',
    semesters: 'Semesters',
    subjects: 'Courses (Subjects)',
    modules: 'Modules',
    units: 'Units',
    topics: 'Topics',
    content: 'Content',
    notes: 'Notes Library',
    'question-papers': 'Question Papers',
    formulas: 'Formula Library',
    videos: 'Video Learning',
    students: 'Students',
    contributors: 'Contributors',
    community: 'Community',
    'academic-tools': 'Academic Tools',
    attendance: 'Attendance',
    gpa: 'GPA Configuration',
    calendar: 'Academic Calendar',
    engagement: 'Engagement',
    notifications: 'Notifications',
    rewards: 'Rewards',
    leaderboard: 'Leaderboard',
    discussions: 'Discussions',
    monetization: 'Monetization',
    'passing-packages': 'Passing Packages',
    premium: 'Premium',
    orders: 'Payments & Orders',
    ads: 'Ads',
    operations: 'Operations',
    'ai-assistant': 'AI Assistant',
    placement: 'Placement',
    internships: 'Internships',
    system: 'System',
    'admin-users': 'Admin Users',
    'audit-logs': 'Audit Logs',
    settings: 'System Settings',
  };

  return (
    <nav className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-4 overflow-x-auto">
      <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Home className="h-3.5 w-3.5" />
        <span>Dashboard</span>
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNames[name] || name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={name}>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0" />
            {isLast ? (
              <span className="font-extrabold text-foreground whitespace-nowrap">{displayName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-primary transition-colors whitespace-nowrap">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
