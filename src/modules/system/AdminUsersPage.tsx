import React, { useState } from 'react';
import {
  Shield,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Mail,
  Building,
  Key,
  MoreVertical,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { Badge } from '../../shared/components/ui/Badge';

interface AdminStaffUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ACADEMIC_DEAN' | 'EXAM_COORDINATOR' | 'FACULTY_MODERATOR';
  department: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastActive: string;
}

const INITIAL_ADMIN_USERS: AdminStaffUser[] = [
  {
    id: 'adm-1',
    name: 'Dr. Ramesh Kumar',
    email: 'ramesh.kumar@vtu.ac.in',
    role: 'SUPER_ADMIN',
    department: 'VTU Central Governance',
    status: 'ACTIVE',
    lastActive: '10 mins ago',
  },
  {
    id: 'adm-2',
    name: 'Prof. Anitha Rao',
    email: 'anitha.rao@vtu.ac.in',
    role: 'ACADEMIC_DEAN',
    department: 'Curriculum & Syllabus Board',
    status: 'ACTIVE',
    lastActive: '2 hours ago',
  },
  {
    id: 'adm-3',
    name: 'Dr. Suresh Patil',
    email: 'suresh.patil@vtu.ac.in',
    role: 'EXAM_COORDINATOR',
    department: 'Evaluation & Examination Directorate',
    status: 'ACTIVE',
    lastActive: 'Yesterday',
  },
  {
    id: 'adm-4',
    name: 'Dr. Priya Hegde',
    email: 'priya.hegde@vtu.ac.in',
    role: 'FACULTY_MODERATOR',
    department: 'Computer Science Department',
    status: 'ACTIVE',
    lastActive: '3 days ago',
  },
];

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminStaffUser[]>(INITIAL_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for new staff
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<AdminStaffUser['role']>('FACULTY_MODERATOR');
  const [newDepartment, setNewDepartment] = useState('Computer Science');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newUser: AdminStaffUser = {
      id: `adm-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      department: newDepartment,
      status: 'ACTIVE',
      lastActive: 'Just now',
    };

    setUsers([newUser, ...users]);
    setNewName('');
    setNewEmail('');
    setIsAddModalOpen(false);
  };

  const toggleStatus = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : u
      )
    );
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q);

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin & Staff Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Console permissions, curriculum board access, and exam moderation team members.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UserPlus className="w-4 h-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border border-gray-200/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Staff</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{users.length}</h3>
          </CardContent>
        </Card>
        <Card className="border border-gray-200/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Super Admins</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">
              {users.filter((u) => u.role === 'SUPER_ADMIN').length}
            </h3>
          </CardContent>
        </Card>
        <Card className="border border-gray-200/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Coordinators</p>
            <h3 className="text-2xl font-bold text-purple-600 mt-1">
              {users.filter((u) => u.role === 'EXAM_COORDINATOR').length}
            </h3>
          </CardContent>
        </Card>
        <Card className="border border-gray-200/80 shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active Status</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {users.filter((u) => u.status === 'ACTIVE').length}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-gray-200/80 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search staff by name, email, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ACADEMIC_DEAN">Academic Dean</option>
                <option value="EXAM_COORDINATOR">Exam Coordinator</option>
                <option value="FACULTY_MODERATOR">Faculty Moderator</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card className="border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Member Name & Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Department / Board</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'SUPER_ADMIN'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : user.role === 'ACADEMIC_DEAN'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : user.role === 'EXAM_COORDINATOR'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Building className="w-3.5 h-3.5 text-gray-400" />
                      {user.department}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={user.status === 'ACTIVE' ? 'success' : 'neutral'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500">{user.lastActive}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStatus(user.id)}
                        className="text-xs text-gray-600 hover:text-gray-900"
                      >
                        {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Add Staff Administrator</h2>
            <p className="text-xs text-gray-500 mb-5">
              Grant governance access and permissions to faculty or exam authorities.
            </p>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <Input
                  required
                  placeholder="e.g. Dr. Harish Gowda"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Official VTU Email</label>
                <Input
                  required
                  type="email"
                  placeholder="e.g. harish.gowda@vtu.ac.in"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Role / Authority</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="FACULTY_MODERATOR">Faculty Moderator (Notes review)</option>
                  <option value="EXAM_COORDINATOR">Exam Coordinator (Question Papers)</option>
                  <option value="ACADEMIC_DEAN">Academic Dean (Syllabus & Schemes)</option>
                  <option value="SUPER_ADMIN">Super Administrator (Full platform control)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Department / Directorate</label>
                <Input
                  required
                  placeholder="e.g. Dept of Computer Science & Eng"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Add Member
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
