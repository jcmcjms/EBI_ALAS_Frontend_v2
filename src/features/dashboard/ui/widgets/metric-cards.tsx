import { CaretDown, CaretUp, CurrencyCircleDollar, ShoppingCart } from '@phosphor-icons/react'
import { Bar, BarChart, Line, LineChart, XAxis } from 'recharts'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/ui/chart'
import { cn } from 'cn'
import type { DashboardSummary } from '../../api/dashboard-types'

const revenueChartConfig = {
  current: { label: 'Current', color: 'var(--chart-4)' },
  previous: { label: 'Previous', color: 'var(--chart-2)' },
} satisfies ChartConfig

const impressionChartConfig = {
  value: { label: 'Impressions', color: 'var(--chart-4)' },
} satisfies ChartConfig

export function DeltaIndicator({ deltaPercent }: { deltaPercent: number }) {
  const isPositive = deltaPercent >= 0
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-xs font-medium',
        isPositive ? 'text-primary' : 'text-destructive'
      )}
    >
      {isPositive ? <CaretUp className="size-3" /> : <CaretDown className="size-3" />}
      {`${isPositive ? '+' : ''}${deltaPercent}%`}
    </span>
  )
}

interface MetricStatCardProps {
  variant: 'orders' | 'profit'
  stat: DashboardSummary['orders']
}

export function MetricStatCard({ variant, stat }: MetricStatCardProps) {
  const StatIcon = variant === 'orders' ? ShoppingCart : CurrencyCircleDollar
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <StatIcon className="size-4" />
        </span>
        <DeltaIndicator deltaPercent={stat.deltaPercent} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-lg font-semibold">{stat.value}</p>
        <p className="text-xs text-muted-foreground">{stat.label}</p>
        <Badge variant="secondary" className="w-fit">
          {stat.period}
        </Badge>
      </CardContent>
    </Card>
  )
}

export function RevenueTrendCard({ revenue }: { revenue: DashboardSummary['revenue'] }) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-baseline gap-2">
          <CardTitle className="text-lg">{revenue.total}</CardTitle>
          <DeltaIndicator deltaPercent={revenue.deltaPercent} />
        </div>
        <CardDescription>Total Revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={revenueChartConfig} className="h-[100px] w-full">
          <BarChart data={revenue.series} barSize={6}>
            <XAxis dataKey="label" hide />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="current" fill="var(--color-current)" />
            <Bar dataKey="previous" fill="var(--color-previous)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ImpressionCard({ impression }: { impression: DashboardSummary['impression'] }) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-base">Impression</CardTitle>
        <CardDescription>Last year</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ChartContainer config={impressionChartConfig} className="h-[80px] w-full">
          <LineChart data={impression.series}>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Line
              type="linear"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        <div className="flex items-end justify-between">
          <p className="text-lg font-semibold">{impression.total}</p>
          <DeltaIndicator deltaPercent={impression.deltaPercent} />
        </div>
      </CardContent>
    </Card>
  )
}