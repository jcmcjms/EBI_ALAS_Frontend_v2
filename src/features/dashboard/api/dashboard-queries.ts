import { useQuery } from '@tanstack/react-query'
import type { DashboardSummary } from './dashboard-types'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
}

// Fixture matches the approved design until the /api/dashboard contract is finalized.
// Swap the body for: const res = await api.get<DashboardSummary>('/api/dashboard/summary'); return res.data!
const DASHBOARD_SUMMARY: DashboardSummary = {
  financeSeries: [
    { month: 'Jan', previous: 12, current: 8 },
    { month: 'Feb', previous: 18, current: 10 },
    { month: 'Mar', previous: 20, current: 20 },
    { month: 'Apr', previous: 15, current: 10 },
    { month: 'May', previous: 22, current: 23 },
    { month: 'Jun', previous: 25, current: 27 },
    { month: 'Jul', previous: 25, current: 20 },
  ],
  report: {
    monthlyAverage: 'Monthly Avg. $45.578k',
    metrics: [
      { id: 'profit', label: 'Total Profit', amount: '$48,568.20' },
      { id: 'income', label: 'Total Income', amount: '$38,453.25' },
      { id: 'expense', label: 'Total Expense', amount: '$2,453.45' },
    ],
  },
  orders: { label: 'Total Orders', value: '155K', deltaPercent: 22, period: 'Last 4 months' },
  profit: { label: 'Total Profit', value: '$89.34k', deltaPercent: -16, period: 'Last One year' },
  revenue: {
    total: '$42.5k',
    deltaPercent: -22,
    series: [
      { label: '1', current: 18, previous: 10 },
      { label: '2', current: 26, previous: 14 },
      { label: '3', current: 16, previous: 9 },
      { label: '4', current: 8, previous: 5 },
      { label: '5', current: 20, previous: 12 },
      { label: '6', current: 24, previous: 13 },
    ],
  },
  impression: {
    total: '175K',
    deltaPercent: 24,
    series: [
      { month: 'Aug', value: 12 },
      { month: 'Sep', value: 16 },
      { month: 'Oct', value: 15 },
      { month: 'Nov', value: 18 },
      { month: 'Dec', value: 16 },
      { month: 'Jan', value: 15 },
      { month: 'Feb', value: 17 },
      { month: 'Mar', value: 20 },
      { month: 'Apr', value: 19 },
      { month: 'May', value: 24 },
    ],
  },
  visitors: {
    total: '23.02K',
    deltaPercent: -6,
    segments: [
      { device: 'Desktop', sharePercent: 17, sessions: '23.8', trend: 'up' },
      { device: 'Tablet', sharePercent: 65, sessions: '13.604', trend: 'down' },
      { device: 'Mobile', sharePercent: 18, sessions: '47.146', trend: 'up' },
    ],
  },
  topProductsBySales: [
    { id: 's1', icon: 'phone', name: 'Samsung galaxy S25', brand: 'Samsung', value: '$32,203' },
    { id: 's2', icon: 'laptop', name: 'Apple MacBook Pro', brand: 'Apple', value: '$1,299' },
    { id: 's3', icon: 'headphones', name: 'Sony WH-1000XM4', brand: 'Sony', value: '$348' },
    { id: 's4', icon: 'monitor', name: 'Dell XPS 13', brand: 'Dell', value: '$999' },
    { id: 's5', icon: 'watch', name: 'Smart band 4', brand: 'Xiaomi', value: '$749' },
  ],
  topProductsByVolume: [
    { id: 'v1', icon: 'monitor', name: 'Dell XPS 13', brand: 'Dell', value: '200k', deltaPercent: 5 },
    { id: 'v2', icon: 'tablet', name: 'Apple iPad', brand: 'Apple', value: '80K', deltaPercent: 10 },
    { id: 'v3', icon: 'game', name: 'Sony PlayStation 5', brand: 'Sony', value: '30k', deltaPercent: -20 },
    { id: 'v4', icon: 'monitor', name: 'IMac pro', brand: 'Apple', value: '15k', deltaPercent: 12 },
    { id: 'v5', icon: 'phone', name: 'Samsung galaxy S25', brand: 'Samsung', value: '12.4k', deltaPercent: -15 },
  ],
}

async function fetchDashboardSummary(): Promise<DashboardSummary> {
  return DASHBOARD_SUMMARY
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: fetchDashboardSummary,
    staleTime: 1000 * 60 * 5,
  })
}