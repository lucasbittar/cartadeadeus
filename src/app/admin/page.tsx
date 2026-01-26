'use client';

import { useEffect, useState } from 'react';
import { copy } from '@/constants/copy';

interface Stats {
  total: number;
  pending: number;
  flagged: number;
  approved: number;
  rejected: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/letters/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      label: copy.admin.dashboard.stats.total,
      value: stats?.total ?? 0,
      color: 'bg-foreground',
    },
    {
      label: copy.admin.dashboard.stats.pending,
      value: stats?.pending ?? 0,
      color: 'bg-amber-500',
    },
    {
      label: copy.admin.dashboard.stats.flagged,
      value: stats?.flagged ?? 0,
      color: 'bg-orange-500',
    },
    {
      label: copy.admin.dashboard.stats.approved,
      value: stats?.approved ?? 0,
      color: 'bg-emerald-500',
    },
    {
      label: copy.admin.dashboard.stats.rejected,
      value: stats?.rejected ?? 0,
      color: 'bg-burgundy',
    },
  ];

  return (
    <div>
      <h2 className="font-playfair text-2xl font-semibold text-foreground mb-6">
        {copy.admin.dashboard.title}
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-background rounded-lg p-6 animate-pulse"
            >
              <div className="h-4 bg-muted-light rounded w-24 mb-3" />
              <div className="h-8 bg-muted-light rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-background rounded-lg p-6 border border-muted-light"
            >
              <p className="text-sm text-muted-dark mb-1">{stat.label}</p>
              <p className="text-3xl font-semibold text-foreground">
                {stat.value}
              </p>
              <div className={`h-1 w-8 ${stat.color} rounded mt-3`} />
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="font-medium text-foreground mb-4">Atalhos</h3>
        <div className="flex gap-4">
          <a
            href="/admin/letters?filter=pending"
            className="bg-background border border-muted-light rounded-lg px-4 py-3 hover:border-foreground transition-colors"
          >
            <span className="text-sm text-muted-dark">Revisar</span>
            <p className="font-medium text-foreground">
              {stats?.pending ?? 0} cartas pendentes
            </p>
          </a>
          <a
            href="/admin/letters?filter=flagged"
            className="bg-background border border-muted-light rounded-lg px-4 py-3 hover:border-foreground transition-colors"
          >
            <span className="text-sm text-muted-dark">Verificar</span>
            <p className="font-medium text-foreground">
              {stats?.flagged ?? 0} cartas sinalizadas
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
