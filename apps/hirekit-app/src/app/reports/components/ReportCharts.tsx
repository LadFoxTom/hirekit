'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const COLORS = ['#4F46E5', '#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#16A34A', '#94A3B8'];

const FALLBACK_STATUS_COLORS: Record<string, string> = {
  new: '#4F46E5',
  screening: '#2563EB',
  interviewing: '#7C3AED',
  offered: '#F59E0B',
  hired: '#16A34A',
  rejected: '#EF4444',
};

interface TrendData {
  date: string;
  count: number;
}

interface PipelineData {
  status: string;
  name?: string;
  color?: string;
  count: number;
}

interface SourceData {
  source: string;
  count: number;
}

export function TrendChart({ data }: { data: TrendData[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
          labelFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#4F46E5"
          strokeWidth={2}
          fill="url(#colorCount)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PipelineChart({ data }: { data: PipelineData[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="status"
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          tickFormatter={(v) => {
            const item = data.find((d) => d.status === v);
            return item?.name || v.charAt(0).toUpperCase() + v.slice(1);
          }}
        />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
          labelFormatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.status} fill={entry.color || FALLBACK_STATUS_COLORS[entry.status] || '#94A3B8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SourceChart({ data }: { data: SourceData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-sm text-[#94A3B8]">
        No source data available yet
      </div>
    );
  }

  return (
    <div className="flex items-center gap-8">
      <ResponsiveContainer width="50%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="count"
            nameKey="source"
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2">
        {data.map((item, i) => (
          <div key={item.source} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-[#1E293B] capitalize">{item.source.replace(/_/g, ' ')}</span>
            </div>
            <span className="font-medium text-[#1E293B]">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
