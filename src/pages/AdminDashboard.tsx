import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from "lucide-react";

interface ResourceStats {
  total_resources: number;
  total_visits: number;
  total_clicks: number;
  resources_by_category: { category: string; count: number }[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('*');

      if (resourcesError) throw resourcesError;

      const { data: analytics, error: analyticsError } = await supabase
        .from('analytics')
        .select('*');

      if (analyticsError) throw analyticsError;

      // Calculate statistics
      const total_resources = resources.length;
      const total_visits = analytics.filter(a => a.event_type === 'visit').length;
      const total_clicks = analytics.filter(a => a.event_type === 'click').length;

      // Group resources by category
      const categoryCount = resources.reduce((acc: Record<string, number>, resource) => {
        acc[resource.category] = (acc[resource.category] || 0) + 1;
        return acc;
      }, {});

      const resources_by_category = Object.entries(categoryCount).map(([category, count]) => ({
        category,
        count,
      }));

      setStats({
        total_resources,
        total_visits,
        total_clicks,
        resources_by_category,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-4xl font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Resources</CardTitle>
            <CardDescription>Number of resources in the database</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.total_resources}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Visits</CardTitle>
            <CardDescription>Number of resource page visits</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.total_visits}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
            <CardDescription>Number of resource link clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.total_clicks}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Resources by Category</CardTitle>
          <CardDescription>Distribution of resources across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ChartContainer>
              <BarChart data={stats?.resources_by_category || []}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6D28D9" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;