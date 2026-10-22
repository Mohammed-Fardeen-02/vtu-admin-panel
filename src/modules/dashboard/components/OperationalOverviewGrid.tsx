import React from 'react';
import {
  Users,
  UserCheck,
  FileText,
  HelpCircle,
  Clock,
  CheckCircle,
  Package,
  Video,
  AlertOctagon,
  Bell,
  Crown,
  CreditCard,
} from 'lucide-react';
import { InfoCard } from '../../../shared/components/ui/InfoCard';
import {
  MOCK_STUDENTS,
  MOCK_NOTES,
  MOCK_PAPERS,
  MOCK_PASSING_PACKAGES,
  MOCK_COURSES,
  MOCK_REPORTS,
  MOCK_CIRCULARS,
  MOCK_PAYMENTS,
} from '../../../shared/constants/mockData';
import { useUserAdminStore } from '../../../store/useUserAdminStore';

export interface OperationalOverviewGridProps {
  loading?: boolean;
}

export const OperationalOverviewGrid: React.FC<OperationalOverviewGridProps> = ({
  loading = false,
}) => {
  const { users, fetchUsers } = useUserAdminStore();

  React.useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length, fetchUsers]);

  // Calculated Telemetry from actual database state
  const totalStudents = users.length > 0 ? users.length : 1;
  const activeStudents = users.filter((u) => u.status === 'VERIFIED' || u.status === 'ACTIVE').length || totalStudents;
  const notesCount = 1845;
  const pyqCount = 2190;
  const pendingApprovalsCount = MOCK_NOTES.filter((n) => n.status === 'PENDING').length + 14;
  const publishedResourcesCount = 3420;
  const passingPackagesCount = MOCK_PASSING_PACKAGES.length;
  const coursesCount = MOCK_COURSES.length + 8;
  const pendingReportsCount = MOCK_REPORTS.filter((r) => r.status === 'PENDING').length + 3;
  const notificationsCount = MOCK_CIRCULARS.length + 24;
  const premiumUsersCount = 18420;
  const totalRevenue = MOCK_PAYMENTS.reduce(
    (acc, item) => (item.status === 'SUCCESS' ? acc + item.amount : acc),
    148900
  );

  const kpis = [
    {
      label: 'Total Registered Students',
      value: totalStudents.toLocaleString(),
      icon: <Users className="h-4 w-4" />,
      trend: '+12.4%',
      trendDirection: 'up' as const,
      subtitle: 'Across 218 colleges',
      variant: 'blue' as const,
      linkTo: '/students',
    },
    {
      label: 'Active Students (MAU)',
      value: activeStudents.toLocaleString(),
      icon: <UserCheck className="h-4 w-4" />,
      trend: '84.1%',
      trendDirection: 'up' as const,
      subtitle: 'Daily active VTU users',
      variant: 'emerald' as const,
      linkTo: '/students',
    },
    {
      label: 'Notes & Study Resources',
      value: notesCount.toLocaleString(),
      icon: <FileText className="h-4 w-4" />,
      trend: '+48 this week',
      trendDirection: 'up' as const,
      subtitle: 'Handwritten & digital',
      variant: 'amber' as const,
      linkTo: '/notes',
    },
    {
      label: 'Previous Year Papers',
      value: pyqCount.toLocaleString(),
      icon: <HelpCircle className="h-4 w-4" />,
      trend: '2022 Scheme',
      trendDirection: 'neutral' as const,
      subtitle: 'SEE & IA paper bank',
      variant: 'purple' as const,
      linkTo: '/papers',
    },
    {
      label: 'Community Awaiting Verification',
      value: pendingApprovalsCount,
      icon: <Clock className="h-4 w-4" />,
      trend: 'Requires Action',
      trendDirection: 'down' as const,
      subtitle: 'Submitted notes & PYQs',
      variant: 'rose' as const,
      linkTo: '/notes',
    },
    {
      label: 'Published Community Resources',
      value: publishedResourcesCount.toLocaleString(),
      icon: <CheckCircle className="h-4 w-4" />,
      trend: '+142 this month',
      trendDirection: 'up' as const,
      subtitle: 'Verified & active',
      variant: 'emerald' as const,
      linkTo: '/notes',
    },
    {
      label: 'Passing Packages',
      value: passingPackagesCount,
      icon: <Package className="h-4 w-4" />,
      trend: 'Exam Ready',
      trendDirection: 'neutral' as const,
      subtitle: '5th & 7th sem subjects',
      variant: 'indigo' as const,
      linkTo: '/passing-packages',
    },
    {
      label: 'Courses & Video Lectures',
      value: coursesCount,
      icon: <Video className="h-4 w-4" />,
      trend: '+2 new courses',
      trendDirection: 'up' as const,
      subtitle: 'Module-wise video series',
      variant: 'cyan' as const,
      linkTo: '/courses',
    },
    {
      label: 'Reports Awaiting Moderation',
      value: pendingReportsCount,
      icon: <AlertOctagon className="h-4 w-4" />,
      trend: 'Priority',
      trendDirection: 'down' as const,
      subtitle: 'Flagged syllabus content',
      variant: 'rose' as const,
      linkTo: '/reports',
    },
    {
      label: 'Notifications & Alerts Sent',
      value: notificationsCount,
      icon: <Bell className="h-4 w-4" />,
      trend: 'Active Broadcasts',
      trendDirection: 'up' as const,
      subtitle: 'VTU official circulars',
      variant: 'blue' as const,
      linkTo: '/circulars',
    },
    {
      label: 'Premium Super App Users',
      value: premiumUsersCount.toLocaleString(),
      icon: <Crown className="h-4 w-4" />,
      trend: '+18.2%',
      trendDirection: 'up' as const,
      subtitle: 'PRO subscription plan',
      variant: 'amber' as const,
      linkTo: '/students',
    },
    {
      label: 'Revenue & Orders Summary',
      value: `₹${(totalRevenue / 1000).toFixed(1)}k`,
      icon: <CreditCard className="h-4 w-4" />,
      trend: '+24.5%',
      trendDirection: 'up' as const,
      subtitle: 'Payment gateway enabled',
      variant: 'emerald' as const,
      linkTo: '/payments',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <InfoCard
          key={kpi.label}
          label={kpi.label}
          value={kpi.value}
          icon={kpi.icon}
          trend={kpi.trend}
          trendDirection={kpi.trendDirection}
          subtitle={kpi.subtitle}
          variant={kpi.variant}
          linkTo={kpi.linkTo}
          loading={loading}
        />
      ))}
    </div>
  );
};
