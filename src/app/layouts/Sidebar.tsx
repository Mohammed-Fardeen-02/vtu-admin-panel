import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  FileText,
  HelpCircle,
  Video,
  Users,
  UserCheck,
  Calendar,
  Calculator,
  Bell,
  Award,
  Layers,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Building2,
  BookMarked,
  Sparkles,
  DollarSign,
  Briefcase,
  Sliders,
  Flame,
  MessageSquare,
  Shield,
  Clock,
  Compass,
} from 'lucide-react';
import { MortarboardSvg } from '../../shared/components/graphics/MortarboardSvg';

interface SubmoduleItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ModuleSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  submodules?: SubmoduleItem[];
  // For single-item sections like Dashboard
  href?: string;
}

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Expanded sections state (default: ACADEMICS and CONTENT open)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Academic Hierarchy': true,
    'Course Structure': true,
    'ACADEMICS': true,
    'CONTENT': true,
    'STUDENTS': false,
    'ACADEMIC TOOLS': false,
    'ENGAGEMENT': false,
    'MONETIZATION': false,
    'OPERATIONS': false,
    'SYSTEM': false,
  });

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const modulesConfig: ModuleSection[] = [
    {
      title: 'ACADEMICS',
      icon: BookOpen,
      submodules: [
        // Sub-group: Academic Hierarchy
        { name: 'Branches', href: '/academics/hierarchy/branches' },
        { name: 'Schemes', href: '/academics/hierarchy/schemes' },
        { name: 'Syllabus', href: '/academics/hierarchy/syllabus' },
        { name: 'Semesters', href: '/academics/hierarchy/semesters' },
        { name: 'Courses (Subjects)', href: '/academics/hierarchy/subjects' },
        // Sub-group: Course Structure
        { name: 'Modules', href: '/academics/course-structure/modules' },
        { name: 'Units', href: '/academics/course-structure/units' },
        { name: 'Topics', href: '/academics/course-structure/topics' },
      ],
    },
    {
      title: 'CONTENT',
      icon: FileText,
      submodules: [
        { name: 'Notes Library', href: '/content/notes', icon: FileText },
        { name: 'Question Papers', href: '/content/question-papers', icon: HelpCircle },
        { name: 'Formula Library', href: '/content/formulas', icon: BookMarked },
        { name: 'Video Learning', href: '/content/videos', icon: Video },
      ],
    },
    {
      title: 'STUDENTS',
      icon: Users,
      submodules: [
        { name: 'Students', href: '/students', icon: Users },
        { name: 'Contributors', href: '/students/contributors', icon: UserCheck },
        { name: 'Community', href: '/students/community', icon: MessageSquare },
      ],
    },
    {
      title: 'ACADEMIC TOOLS',
      icon: Calculator,
      submodules: [
        { name: 'Attendance', href: '/academic-tools/attendance', icon: Clock },
        { name: 'GPA Configuration', href: '/academic-tools/gpa', icon: Calculator },
        { name: 'Academic Calendar', href: '/academic-tools/calendar', icon: Calendar },
      ],
    },
    {
      title: 'ENGAGEMENT',
      icon: Bell,
      submodules: [
        { name: 'Notifications', href: '/engagement/notifications', icon: Bell },
        { name: 'Rewards', href: '/engagement/rewards', icon: Award },
        { name: 'Leaderboard', href: '/engagement/leaderboard', icon: Flame },
        { name: 'Discussions', href: '/engagement/discussions', icon: MessageSquare },
      ],
    },
    {
      title: 'MONETIZATION',
      icon: DollarSign,
      submodules: [
        { name: 'Passing Packages', href: '/monetization/passing-packages', icon: Layers },
        { name: 'Premium', href: '/monetization/premium', icon: Sparkles },
        { name: 'Payments & Orders', href: '/monetization/orders', icon: DollarSign },
        { name: 'Ads', href: '/monetization/ads', icon: Sliders },
      ],
    },
    {
      title: 'OPERATIONS',
      icon: Briefcase,
      submodules: [
        { name: 'AI Assistant', href: '/operations/ai-assistant', icon: Sparkles },
        { name: 'Placement', href: '/operations/placement', icon: Briefcase },
        { name: 'Internships', href: '/operations/internships', icon: Compass },
      ],
    },
    {
      title: 'SYSTEM',
      icon: Settings,
      submodules: [
        { name: 'Admin Users', href: '/system/admin-users', icon: Shield },
        { name: 'Audit Logs', href: '/system/audit-logs', icon: Clock },
        { name: 'System Settings', href: '/system/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <MortarboardSvg className="w-9 h-9 flex-shrink-0" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-white leading-tight">
                VTU SUPER APP
              </span>
              <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">
                Governance Portal
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-sidebar-accent hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* University Badge Tag */}
      {!collapsed && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-blue-400 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white leading-tight">VTU Belagavi</span>
            <span className="text-[10px] text-slate-400">Autonomous Admin Console</span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 space-y-3 px-3 py-4 overflow-y-auto">
        {/* Dashboard Link */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              isActive
                ? 'bg-sidebar-primary text-white shadow-md shadow-blue-900/40 font-extrabold'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="h-4 w-4 flex-shrink-0 text-slate-400 group-hover:text-white" />
          {!collapsed && <span>Dashboard Overview</span>}
        </NavLink>

        {/* Modules & Submodules Sections */}
        {modulesConfig.map((module) => {
          const isExpanded = expandedSections[module.title] ?? false;
          const hasActiveChild = module.submodules?.some((sub) =>
            location.pathname.startsWith(sub.href)
          );

          return (
            <div key={module.title} className="space-y-1">
              {/* Module Category Header */}
              {!collapsed ? (
                <button
                  onClick={() => toggleSection(module.title)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-colors ${
                    hasActiveChild
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <module.icon className="h-3.5 w-3.5 opacity-70" />
                    <span>{module.title}</span>
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      isExpanded ? 'transform rotate-0' : 'transform -rotate-90'
                    }`}
                  />
                </button>
              ) : (
                <div className="px-3 py-1 text-[9px] font-black text-slate-400 uppercase text-center truncate">
                  {module.title.substring(0, 3)}
                </div>
              )}

              {/* Submodules List */}
              {(isExpanded || collapsed) && module.submodules && (
                <div className={`${!collapsed ? 'pl-2 space-y-0.5 border-l border-slate-800 ml-3' : 'space-y-1'}`}>
                  {/* Special Visual Separator for Academic Hierarchy vs Course Structure */}
                  {module.title === 'ACADEMICS' && !collapsed && (
                    <div className="pt-1">
                      <div className="text-[9px] font-extrabold text-blue-400/80 tracking-wider uppercase px-2 py-0.5">
                        Academic Hierarchy
                      </div>
                    </div>
                  )}

                  {module.submodules.map((sub, idx) => {
                    // Inject Course Structure sub-header inside ACADEMICS at index 5 (Modules)
                    const isCourseStructureHeader = module.title === 'ACADEMICS' && idx === 5;
                    const isActive = location.pathname === sub.href;

                    return (
                      <React.Fragment key={sub.href}>
                        {isCourseStructureHeader && !collapsed && (
                          <div className="pt-2">
                            <div className="text-[9px] font-extrabold text-indigo-400/80 tracking-wider uppercase px-2 py-0.5">
                              Course Structure
                            </div>
                          </div>
                        )}
                        <NavLink
                          to={sub.href}
                          className={({ isActive }) =>
                            `group flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs transition-all ${
                              isActive
                                ? 'bg-sidebar-primary text-white font-extrabold shadow-sm'
                                : 'text-slate-300 hover:bg-sidebar-accent hover:text-white font-medium'
                            }`
                          }
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full flex-shrink-0 transition-colors ${
                              isActive ? 'bg-blue-400' : 'bg-slate-500 group-hover:bg-white'
                            }`}
                          />
                          {!collapsed && <span className="truncate">{sub.name}</span>}
                        </NavLink>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Controller Information Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white border-2 border-blue-400 shadow-sm text-xs">
              KV
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-bold text-white truncate">Dr. K. V. Suresh</span>
              <span className="text-[10px] text-slate-400 truncate">Exam Controller</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
