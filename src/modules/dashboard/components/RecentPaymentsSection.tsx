import React from 'react';
import { CreditCard, ArrowUpRight, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { MOCK_PAYMENTS } from '../../../shared/constants/mockData';

export const RecentPaymentsSection: React.FC = () => {
  return (
    <Card className="h-full border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-extrabold flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-emerald-500" />
            <span>Recent Payments & Order Summary</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time transaction log for premium unlocks and passing packages.
          </p>
        </div>
        <Link to="/payments">
          <Button variant="outline" size="sm" icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
            Financials
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {MOCK_PAYMENTS.map((payment) => (
          <div
            key={payment.id}
            className="p-3 rounded-xl border border-border bg-card hover:bg-accent/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{payment.orderId}</span>
                <Badge variant="primary" className="text-[10px]">
                  {payment.planName.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Student: <span className="font-semibold text-foreground">{payment.studentName} ({payment.studentUsn})</span>
              </p>
              <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                <span>Method: {payment.paymentMethod}</span>
                <span>•</span>
                <span>{payment.paymentDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                ₹{payment.amount}
              </span>
              <Badge
                variant={payment.status === 'SUCCESS' ? 'success' : 'error'}
                className="text-[10px]"
              >
                {payment.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
