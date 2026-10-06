export interface FinanceSeriesPoint {
  month: string
  current: number
  previous: number
}

export interface ReportMetric {
  id: 'profit' | 'income' | 'expense'
  label: string
  amount: string
}

export interface MetricStat {
  label: string
  value: string
  deltaPercent: number
  period: string
}

export interface RevenuePoint {
  label: string
  current: number
  previous: number
}

export interface ImpressionPoint {
  month: string
  value: number
}

export interface VisitorSegment {
  device: 'Desktop' | 'Tablet' | 'Mobile'
  sharePercent: number
  sessions: string
  trend: 'up' | 'down'
}

export type ProductIconKey =
  | 'phone'
  | 'laptop'
  | 'headphones'
  | 'monitor'
  | 'watch'
  | 'tablet'
  | 'game'

export interface ProductRow {
  id: string
  icon: ProductIconKey
  name: string
  brand: string
  value: string
  deltaPercent?: number
}

export interface DashboardSummary {
  financeSeries: FinanceSeriesPoint[]
  report: { monthlyAverage: string; metrics: ReportMetric[] }
  orders: MetricStat
  profit: MetricStat
  revenue: { total: string; deltaPercent: number; series: RevenuePoint[] }
  impression: { total: string; deltaPercent: number; series: ImpressionPoint[] }
  visitors: { total: string; deltaPercent: number; segments: VisitorSegment[] }
  topProductsBySales: ProductRow[]
  topProductsByVolume: ProductRow[]
}