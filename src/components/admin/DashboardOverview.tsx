import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Trophy,
  TrendingUp,
  UserPlus,
  Trophy as TrophyIcon,
  ArrowRight,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area
} from "recharts";

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    upcomingTournaments: 0,
    spedBookings: 0,
    pendingSped: 0,
  });
  const [membershipGrowth, setMembershipGrowth] = useState<any[]>([]);
  const [spedData, setSpedData] = useState<any[]>([]);
  const [recentTournaments, setRecentTournaments] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Members Stats
      const { data: members, error: membersError } = await (supabase as any)
        .from('all_members')
        .select('created_at, current_membership_status');

      if (membersError) throw membersError;

      const totalMembers = members?.length || 0;
      const activeMembers = members?.filter((m: any) => m.current_membership_status === 'active').length || 0;

      // Calculate membership growth (past 6 months)
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
          month: d.toLocaleString('default', { month: 'short' }),
          year: d.getFullYear(),
          count: 0,
          sortKey: d.getFullYear() * 100 + d.getMonth()
        };
      }).reverse();

      members?.forEach((m: any) => {
        const date = new Date(m.created_at);
        const monthGroup = last6Months.find(g =>
          g.month === date.toLocaleString('default', { month: 'short' }) &&
          g.year === date.getFullYear()
        );
        if (monthGroup) monthGroup.count++;
      });

      // Accumulate growth
      let cumulative = totalMembers - last6Months.reduce((sum, m) => sum + m.count, 0);
      const growthData = last6Months.map(m => {
        cumulative += m.count;
        return { month: m.month, members: cumulative };
      });

      // 2. Fetch Tournament Stats
      const { data: tournaments, error: tourneyError } = await (supabase as any)
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: true });

      if (tourneyError) throw tourneyError;

      const now = new Date();
      const upcomingTournaments = tournaments?.filter((t: any) => t.start_date && new Date(t.start_date) > now).length || 0;

      // 3. Fetch SPED Stats
      const { data: spedBookings, error: spedError } = await (supabase as any)
        .from('confirmed_bookings')
        .select('created_at, booking_date');

      if (spedError) throw spedError;

      const { count: pendingSped } = await (supabase as any)
        .from('confirmed_bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const spedStatsData = last6Months.map(m => {
        const count = spedBookings?.filter((b: any) => {
          const date = new Date(b.created_at);
          return date.toLocaleString('default', { month: 'short' }) === m.month &&
            date.getFullYear() === m.year;
        }).length || 0;
        return { month: m.month, bookings: count };
      });

      setStats({
        totalMembers,
        activeMembers,
        upcomingTournaments,
        spedBookings: spedBookings?.length || 0,
        pendingSped: pendingSped || 0,
      });

      setMembershipGrowth(growthData);
      setSpedData(spedStatsData);
      setRecentTournaments(tournaments?.slice(0, 3) || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      label: "Memberships",
      icon: UserPlus,
      onClick: () => navigate('/admin/members'),
      color: "border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50",
    },
    {
      label: "Tournaments",
      icon: TrophyIcon,
      onClick: () => navigate('/admin/tournaments'),
      color: "border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50",
    },
    {
      label: "Finance & SPED",
      icon: FileText,
      onClick: () => navigate('/admin/finance'),
      color: "border-yellow-100 bg-white text-yellow-700 hover:bg-yellow-50",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-4 w-32 rounded-lg" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-12 w-32 rounded-2xl" />
            <Skeleton className="h-12 w-32 rounded-2xl" />
            <Skeleton className="h-12 w-32 rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-3xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-80 w-full rounded-3xl" />
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Apple-style Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black uppercase italic">
            Overview
          </h1>
          <p className="text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em]">
            Command Center
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 font-black text-[10px] md:text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] ${action.color}`}
            >
              <action.icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid - Minimal Apple Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Memberships"
          value={stats.totalMembers}
          icon={Users}
          subtitle={`${stats.activeMembers} active`}
          activeIn={true}
        />
        <StatsCard
          title="Tournaments"
          value={stats.upcomingTournaments}
          icon={Trophy}
          subtitle="Proposed events"
          activeIn={true}
        />
        <StatsCard
          title="SPED Bookings"
          value={stats.spedBookings}
          icon={Calendar}
          subtitle="Confirmed sessions"
          activeIn={false}
          isYellow
        />
        <StatsCard
          title="Manual Review"
          value={stats.pendingSped}
          icon={TrendingUp}
          subtitle="Pending"
          activeIn={false}
          isYellow={stats.pendingSped > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Membership Growth Area Chart */}
        <Card className="border-none shadow-none bg-gray-50/50 overflow-hidden rounded-3xl p-1">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-bold text-black flex items-center justify-between">
              Growth Trends
              <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={membershipGrowth}>
                  <defs>
                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 ring-1 ring-black/5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                            <p className="text-xl font-black text-emerald-600">
                              {payload[0].value} <span className="text-xs font-bold text-gray-400">Members</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="members"
                    stroke="#059669"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMembers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* SPED Monthly Activity Bar Chart */}
        <Card className="border-none shadow-none bg-gray-50/50 overflow-hidden rounded-3xl p-1">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-bold text-black flex items-center justify-between">
              SPED Activity
              <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Calendar className="h-4 w-4 text-yellow-500" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spedData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    cursor={{ fill: '#059669', opacity: 0.05 }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 ring-1 ring-black/5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                            <p className="text-xl font-black text-emerald-600">
                              {payload[0].value} <span className="text-xs font-bold text-gray-400">Bookings</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="bookings" fill="#059669" radius={[6, 6, 6, 6]} barSize={24}>
                    {spedData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === spedData.length - 1 ? '#EAB308' : '#059669'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tournaments Minimal List */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-3xl border border-gray-100">
        <CardHeader className="p-8 flex flex-row items-center justify-between border-b border-gray-50">
          <CardTitle className="text-lg font-bold text-black flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-emerald-600" />
            </div>
            Upcoming Roadmap
          </CardTitle>
          <Button variant="ghost" className="text-emerald-700 font-bold text-sm rounded-xl" onClick={() => navigate('/admin/tournaments')}>
            Full Schedule
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {recentTournaments.length > 0 ? (
              recentTournaments.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-6 hover:bg-emerald-50/10 transition-all group cursor-pointer" onClick={() => navigate('/admin/tournaments')}>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-gray-400 group-hover:text-emerald-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-black text-lg group-hover:text-emerald-700 transition-colors">{t.name}</p>
                      <div className="flex items-center gap-2 text-gray-400 font-medium text-sm">
                        <span className="capitalize">{t.tournament_type?.replace(/_/g, ' ') || 'Tournament'}</span>
                        <span>•</span>
                        <span>{t.location || 'Location TBD'}</span>
                        <span>•</span>
                        <span className="text-emerald-600">{t.start_date ? new Date(t.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Date TBD'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-2 opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowRight className="h-4 w-4 text-gray-900" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-2">
                <Trophy className="h-10 w-10 text-gray-100 mx-auto" />
                <p className="text-gray-400 font-bold text-sm">No scheduled events</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatsCard = ({ title, value, icon: Icon, subtitle, activeIn, isYellow }: any) => (
  <Card className="border-none shadow-none bg-white overflow-hidden rounded-[2rem] hover:shadow-sm transition-all group cursor-default border border-gray-100">
    <CardContent className="p-5 md:p-6">
      <div className="flex flex-col gap-4 md:gap-5">
        <div className="flex items-start justify-between">
          <div className={`h-10 w-10 md:h-11 md:w-11 rounded-xl flex items-center justify-center transition-all ${isYellow ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-600'}`}>
            <Icon className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          {activeIn && <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />}
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-black mb-0.5">{value}</h3>
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
            {subtitle && <p className="text-[10px] font-bold text-gray-300">{subtitle}</p>}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);