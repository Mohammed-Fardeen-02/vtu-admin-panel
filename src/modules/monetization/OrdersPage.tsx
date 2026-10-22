import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Download,
  FileText,
  User,
  Clock,
  ArrowUpRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { Badge } from '../../shared/components/ui/Badge';
import { apiClient } from '../../shared/api/apiClient';

interface OrderItem {
  id: string;
  userId?: string;
  noteId: string;
  amount: number;
  status: string;
  paymentId?: string;
  createdAt: string;
  note?: {
    id: string;
    title: string;
    subjectCode: string;
    subjectName: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res: any = await apiClient.get('/orders');
      // Server response shape: { success: true, message: "...", data: { total: 8, totalRevenue: 76, items: [...] } }
      const payload = res?.data?.data || res?.data || res;
      const items = payload?.items || (Array.isArray(payload) ? payload : []);
      if (Array.isArray(items)) {
        setOrders(items);
      }
    } catch (err: any) {
      console.warn('Failed to fetch live orders from API:', err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const completedOrdersList = useMemo(() => orders.filter((o) => o.status === 'COMPLETED'), [orders]);
  const totalRevenue = useMemo(() => completedOrdersList.reduce((sum, o) => sum + (o.amount || 0), 0), [completedOrdersList]);
  const completedOrders = completedOrdersList.length;

  // Aggregate statistics per paper / note resource
  const resourceStats = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        title: string;
        subjectCode: string;
        subjectName: string;
        purchasesCount: number;
        revenue: number;
        lastPurchased: string;
      }
    >();

    orders.forEach((o) => {
      const resId = o.noteId || o.note?.id || 'unknown';
      const existing = map.get(resId);
      const isCompleted = o.status === 'COMPLETED';

      if (!existing) {
        map.set(resId, {
          id: resId,
          title: o.note?.title || 'Academic Course Resource',
          subjectCode: o.note?.subjectCode || 'VTU',
          subjectName: o.note?.subjectName || '',
          purchasesCount: isCompleted ? 1 : 0,
          revenue: isCompleted ? (o.amount || 0) : 0,
          lastPurchased: o.createdAt,
        });
      } else {
        if (isCompleted) {
          existing.purchasesCount += 1;
          existing.revenue += (o.amount || 0);
        }
        if (new Date(o.createdAt) > new Date(existing.lastPurchased)) {
          existing.lastPurchased = o.createdAt;
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => b.purchasesCount - a.purchasesCount);
  }, [orders]);

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      o.id.toLowerCase().includes(q) ||
      (o.paymentId && o.paymentId.toLowerCase().includes(q)) ||
      (o.note?.title && o.note.title.toLowerCase().includes(q)) ||
      (o.user?.email && o.user.email.toLowerCase().includes(q));

    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payments & Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Student digital note purchase logs, transaction verification, and revenue telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border border-gray-200/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>100% digital instant settlements</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Transactions</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">Across mobile app purchases</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Successful Unlocks</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{completedOrders}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">Full PDF entitlements granted</p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200/80 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Average Order Value</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 19}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">Micro-payments tier</p>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Per-Resource Purchase Telemetry Breakdown */}
      <Card className="border border-gray-200/80 shadow-xs">
        <CardHeader className="p-5 pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Per-Paper / Note Purchase Performance
            </CardTitle>
            <p className="text-xs text-gray-500">
              Live purchase volume, customer unlocks, and gross revenue generated by each academic resource.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold">
            {resourceStats.length} Unique Resources Sold
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Resource / Paper</th>
                  <th className="py-3 px-5">Subject</th>
                  <th className="py-3 px-5 text-center">Purchases Count</th>
                  <th className="py-3 px-5 text-right">Gross Revenue</th>
                  <th className="py-3 px-5 text-right">Latest Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {resourceStats.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                      No purchased resources recorded yet.
                    </td>
                  </tr>
                ) : (
                  resourceStats.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-5 font-semibold text-gray-900">
                        <div className="line-clamp-1">{item.title}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{item.id}</div>
                      </td>
                      <td className="py-3 px-5">
                        <span className="font-bold text-blue-600 font-mono text-xs mr-1.5">
                          {item.subjectCode}
                        </span>
                        <span className="text-xs text-gray-500">{item.subjectName}</span>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {item.purchasesCount} {item.purchasesCount === 1 ? 'sale' : 'sales'}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right font-bold text-gray-900">
                        ₹{item.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-5 text-right text-xs text-gray-500">
                        {item.lastPurchased ? new Date(item.lastPurchased).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Filter and Search Bar */}
      <Card className="border border-gray-200/80 shadow-xs">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by order ID, note, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID & Gateway</th>
                <th className="py-3.5 px-4">Resource Title</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No orders or transactions matching criteria
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-900 font-mono text-xs">{order.id}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {order.paymentId || 'Instant Unlock'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800 line-clamp-1">
                        {order.note?.title || 'Course Notes Unlock'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.note?.subjectCode} {order.note?.subjectName ? `• ${order.note.subjectName}` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800">{order.user?.name || 'VTU Student'}</div>
                      <div className="text-xs text-gray-500">{order.user?.email || 'App User'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      ₹{order.amount || 19}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          order.status === 'COMPLETED'
                            ? 'success'
                            : order.status === 'PENDING'
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
