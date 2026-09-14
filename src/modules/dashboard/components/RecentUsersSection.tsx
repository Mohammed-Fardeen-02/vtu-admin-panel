import React from 'react';
import { Users, ArrowUpRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { MOCK_STUDENTS } from '../../../shared/constants/mockData';

export const RecentUsersSection: React.FC = () => {
  return (
    <Card className="h-full border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Recent Student Registrations</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Newly onboarded engineering students with validated USN credentials.
          </p>
        </div>
        <Link to="/students">
          <Button variant="outline" size="sm" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
            Directory
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-table-header-bg text-table-header-text">
                <th className="p-3 font-extrabold rounded-tl-xl">USN</th>
                <th className="p-3 font-extrabold">Student Name</th>
                <th className="p-3 font-extrabold">College Name</th>
                <th className="p-3 font-extrabold">Branch</th>
                <th className="p-3 font-extrabold">Sem</th>
                <th className="p-3 font-extrabold">CGPA</th>
                <th className="p-3 font-extrabold rounded-tr-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.id} className="hover:bg-accent/40 transition-colors">
                  <td className="p-3 font-bold text-primary">{student.usn}</td>
                  <td className="p-3 font-semibold text-foreground">{student.name}</td>
                  <td className="p-3 text-muted-foreground">{student.college}</td>
                  <td className="p-3 font-bold">{student.branch}</td>
                  <td className="p-3 font-semibold">Sem {student.semester}</td>
                  <td className="p-3 font-black text-foreground">{student.cgpa.toFixed(2)}</td>
                  <td className="p-3">
                    <Badge
                      variant={student.status === 'VERIFIED' || student.status === 'ACTIVE' ? 'success' : 'warning'}
                      className="text-[10px]"
                    >
                      {student.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
