import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, TrendingUp, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const PODashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 150,
    totalJobs: 45,
    totalPlaced: 85,
    avgPackage: "8.5 LPA"
  });

  const branchData = [
    { name: 'CSE', placed: 40, total: 50 },
    { name: 'ECE', placed: 25, total: 35 },
    { name: 'MECH', placed: 15, total: 40 },
    { name: 'CIVIL', placed: 5, total: 25 },
  ];

  const companyData = [
    { name: 'Tech', value: 45 },
    { name: 'Core', value: 25 },
    { name: 'Finance', value: 20 },
    { name: 'Consulting', value: 10 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Placement Officer Dashboard</h2>
        <p className="text-muted-foreground mt-1">Platform analytics and placement statistics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary"><Users className="w-6 h-6" /></div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Total Students</div>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-secondary p-3 rounded-full text-secondary-foreground"><Briefcase className="w-6 h-6" /></div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Active Jobs</div>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full text-green-600"><CheckCircle className="w-6 h-6" /></div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Students Placed</div>
            <div className="text-2xl font-bold">{stats.totalPlaced}</div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="bg-accent p-3 rounded-full text-accent-foreground"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Avg Package</div>
            <div className="text-2xl font-bold">{stats.avgPackage}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Branch-wise Placements</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend />
                <Bar dataKey="total" fill="#93c5fd" name="Total Students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placed" fill="#3b82f6" name="Placed Students" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="text-lg font-semibold mb-6 text-foreground">Hiring by Industry</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={companyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {companyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PODashboard;
