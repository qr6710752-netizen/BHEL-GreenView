
"use client";

import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { EnergyChart } from "@/components/dashboard/energy-chart";
import { WasteChart } from "@/components/dashboard/waste-chart";
import { InitiativesList } from "@/components/dashboard/initiatives-list";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";
import { TrendingUp, Trash2, Cloud, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <PageHeader title="Dashboard" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Power Usage"
            value="4,250 kWh"
            change="+5.2% this month"
            icon={<Zap className="w-6 h-6 text-yellow-500" />}
            trendIcon={<TrendingUp className="w-4 h-4 text-green-500" />}
          />
          <MetricCard
            title="Waste Generation"
            value="1,120 kg"
            change="-2.8% this month"
            icon={<Trash2 className="w-6 h-6 text-red-500" />}
            trendIcon={<TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
          />
          <MetricCard
            title="CO2 Emissions"
            value="2.5 tCO2e"
            change="+3.1% this month"
            icon={<Cloud className="w-6 h-6 text-gray-500" />}
            trendIcon={<TrendingUp className="w-4 h-4 text-green-500" />}
          />
        </div>
        <div className="grid gap-6 mt-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <EnergyChart />
          </div>
          <div className="lg:col-span-2">
            <WasteChart />
          </div>
        </div>
        <div className="grid gap-6 mt-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <InitiativesList />
          </div>
          <div>
            <LeaderboardCard />
          </div>
        </div>
      </main>
    </div>
  );
}
