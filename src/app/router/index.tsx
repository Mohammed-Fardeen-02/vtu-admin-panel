import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardPage } from '../../modules/dashboard/DashboardPage';
import { LoginPage } from '../../modules/auth/LoginPage';

// Academics - Hierarchy
import { BranchesPage } from '../../modules/academics/hierarchy/branches/pages/BranchesPage';
import { SchemesPage } from '../../modules/academics/hierarchy/schemes/pages/SchemesPage';
import { SyllabusPage } from '../../modules/academics/hierarchy/syllabus/pages/SyllabusPage';
import { SemestersPage } from '../../modules/academics/hierarchy/semesters/pages/SemestersPage';
import { SubjectsPage } from '../../modules/academics/hierarchy/subjects/pages/SubjectsPage';

// Academics - Course Structure
import { ModulesPage } from '../../modules/academics/course-structure/modules/pages/ModulesPage';
import { UnitsPage } from '../../modules/academics/course-structure/units/pages/UnitsPage';
import { TopicsPage } from '../../modules/academics/course-structure/topics/pages/TopicsPage';

// Content & Learning
import { NotesModerationPage } from '../../modules/notes/NotesModerationPage';
import { QuestionPapersPage } from '../../modules/papers/QuestionPapersPage';
import { VideoCoursesPage } from '../../modules/videos/VideoCoursesPage';

// Students
import { StudentsListPage } from '../../modules/students/StudentsListPage';
import { ContributorDirectoryPage } from '../../modules/contributors/ContributorDirectoryPage';

// Academic Tools
import { SchemeConfigPage } from '../../modules/grading/SchemeConfigPage';
import { AcademicCalendarPage } from '../../modules/calendar/AcademicCalendarPage';

// Engagement & Monetization
import { CircularsPage } from '../../modules/circulars/CircularsPage';
import { RewardRulesPage } from '../../modules/rewards/RewardRulesPage';
import { PassingPackagesPage } from '../../modules/packages/PassingPackagesPage';
import { OrdersPage } from '../../modules/monetization/OrdersPage';

// System
import { SettingsPage } from '../../modules/settings/SettingsPage';
import { AdminUsersPage } from '../../modules/system/AdminUsersPage';

// Standardized Submodule Placeholder
import { SubmodulePlaceholderPage } from '../../shared/components/pages/SubmodulePlaceholderPage';
import { BookMarked, Users, Clock, Flame, MessageSquare, Sparkles, DollarSign, Sliders, Briefcase, Compass, Shield } from 'lucide-react';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // ----------------------------------------------------
      // MODULE: ACADEMICS -> Academic Hierarchy
      // ----------------------------------------------------
      {
        path: 'academics/hierarchy/branches',
        element: <BranchesPage />,
      },
      {
        path: 'academics/hierarchy/schemes',
        element: <SchemesPage />,
      },
      {
        path: 'academics/hierarchy/syllabus',
        element: <SyllabusPage />,
      },
      {
        path: 'academics/hierarchy/semesters',
        element: <SemestersPage />,
      },
      {
        path: 'academics/hierarchy/subjects',
        element: <SubjectsPage />,
      },

      // ----------------------------------------------------
      // MODULE: ACADEMICS -> Course Structure
      // ----------------------------------------------------
      {
        path: 'academics/course-structure/modules',
        element: <ModulesPage />,
      },
      {
        path: 'academics/course-structure/units',
        element: <UnitsPage />,
      },
      {
        path: 'academics/course-structure/topics',
        element: <TopicsPage />,
      },

      // ----------------------------------------------------
      // MODULE: CONTENT
      // ----------------------------------------------------
      {
        path: 'content/notes',
        element: <NotesModerationPage />,
      },
      {
        path: 'content/question-papers',
        element: <QuestionPapersPage />,
      },
      {
        path: 'content/formulas',
        element: (
          <SubmodulePlaceholderPage
            moduleName="CONTENT"
            submoduleName="Formula Library"
            description="Central Engineering Formulae, Theorem derivations, and Quick Reference cards."
            icon={BookMarked}
          />
        ),
      },
      {
        path: 'content/videos',
        element: <VideoCoursesPage />,
      },

      // ----------------------------------------------------
      // MODULE: STUDENTS
      // ----------------------------------------------------
      {
        path: 'students',
        element: <StudentsListPage />,
      },
      {
        path: 'students/contributors',
        element: <ContributorDirectoryPage />,
      },
      {
        path: 'students/community',
        element: (
          <SubmodulePlaceholderPage
            moduleName="STUDENTS"
            submoduleName="Community"
            description="Student discussion forums, peer-to-peer note exchanges, and study groups."
            icon={Users}
          />
        ),
      },

      // ----------------------------------------------------
      // MODULE: ACADEMIC TOOLS
      // ----------------------------------------------------
      {
        path: 'academic-tools/attendance',
        element: (
          <SubmodulePlaceholderPage
            moduleName="ACADEMIC TOOLS"
            submoduleName="Attendance"
            description="VTU minimum 85% attendance tracker, condonation rules, and margin calculations."
            icon={Clock}
          />
        ),
      },
      {
        path: 'academic-tools/gpa',
        element: <SchemeConfigPage />,
      },
      {
        path: 'academic-tools/calendar',
        element: <AcademicCalendarPage />,
      },

      // ----------------------------------------------------
      // MODULE: ENGAGEMENT
      // ----------------------------------------------------
      {
        path: 'engagement/notifications',
        element: <CircularsPage />,
      },
      {
        path: 'engagement/rewards',
        element: <RewardRulesPage />,
      },
      {
        path: 'engagement/leaderboard',
        element: (
          <SubmodulePlaceholderPage
            moduleName="ENGAGEMENT"
            submoduleName="Leaderboard"
            description="Gamified academic ranks, coin leaderboards, and top contributor standings."
            icon={Flame}
          />
        ),
      },
      {
        path: 'engagement/discussions',
        element: (
          <SubmodulePlaceholderPage
            moduleName="ENGAGEMENT"
            submoduleName="Discussions"
            description="Subject doubt clearance channels, solution threads, and faculty Q&A."
            icon={MessageSquare}
          />
        ),
      },

      // ----------------------------------------------------
      // MODULE: MONETIZATION
      // ----------------------------------------------------
      {
        path: 'monetization/passing-packages',
        element: <PassingPackagesPage />,
      },
      {
        path: 'monetization/premium',
        element: (
          <SubmodulePlaceholderPage
            moduleName="MONETIZATION"
            submoduleName="Premium"
            description="VTU Pro Subscription tiers, ad-free reading passes, and offline downloads."
            icon={Sparkles}
          />
        ),
      },
      {
        path: 'monetization/orders',
        element: <OrdersPage />,
      },
      {
        path: 'monetization/ads',
        element: (
          <SubmodulePlaceholderPage
            moduleName="MONETIZATION"
            submoduleName="Ads"
            description="Google AdMob & custom banner ad inventory placements and CTR analytics."
            icon={Sliders}
          />
        ),
      },

      // ----------------------------------------------------
      // MODULE: OPERATIONS
      // ----------------------------------------------------
      {
        path: 'operations/ai-assistant',
        element: (
          <SubmodulePlaceholderPage
            moduleName="OPERATIONS"
            submoduleName="AI Assistant"
            description="VTU Syllabus AI Chatbot prompt tuning, vector search index, and response logs."
            icon={Sparkles}
          />
        ),
      },
      {
        path: 'operations/placement',
        element: (
          <SubmodulePlaceholderPage
            moduleName="OPERATIONS"
            submoduleName="Placement"
            description="Campus placement drives, company eligibility criteria, and interview experiences."
            icon={Briefcase}
          />
        ),
      },
      {
        path: 'operations/internships',
        element: (
          <SubmodulePlaceholderPage
            moduleName="OPERATIONS"
            submoduleName="Internships"
            description="AICTE & VTU mandatory internship opportunities and completion certificates."
            icon={Compass}
          />
        ),
      },

      // ----------------------------------------------------
      // MODULE: SYSTEM
      // ----------------------------------------------------
      {
        path: 'system/admin-users',
        element: <AdminUsersPage />,
      },
      {
        path: 'system/audit-logs',
        element: (
          <SubmodulePlaceholderPage
            moduleName="SYSTEM"
            submoduleName="Audit Logs"
            description="Security audit trail of content approvals, deletions, and configuration changes."
            icon={Clock}
          />
        ),
      },
      {
        path: 'system/settings',
        element: <SettingsPage />,
      },

      // ----------------------------------------------------
      // LEGACY ROUTE REDIRECTS (Prevents broken bookmarks)
      // ----------------------------------------------------
      {
        path: 'academic-structure',
        element: <Navigate to="/academics/hierarchy/branches" replace />,
      },
      {
        path: 'syllabus-modules',
        element: <Navigate to="/academics/course-structure/modules" replace />,
      },
      {
        path: 'notes',
        element: <Navigate to="/content/notes" replace />,
      },
      {
        path: 'papers',
        element: <Navigate to="/content/question-papers" replace />,
      },
      {
        path: 'videos',
        element: <Navigate to="/content/videos" replace />,
      },

      // Catch-all route
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
