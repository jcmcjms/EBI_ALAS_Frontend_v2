import { Coins, CreditCard, DotsThreeVertical, Receipt } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/shared/ui/chart'
import type { DashboardSummary } from '../../api/dashboard-types'

const financeChartConfig = {
  previous: { label: 'Previous', color: 'var(--chart-2)' },
  current: { label: 'Current', color: 'var(--chart-4)' },
} satisfies ChartConfig

const REPORT_ICONS: Record<string, Icon> = {
  profit: Coins,
  income: CreditCard,
  expense: Receipt,
}

function CardOptionsButton({ label }: { label: string }) {
  /* TODO: attach per-card menu (export / configure) once actions are defined */
  return (
    <Button variant="ghost" size="icon-xs" aria-label={`${label} options`}>
      <DotsThreeVertical className="size-4 text-muted-foreground" />
    </Button>
  )
}

export function FinanceChartCard({ series }: { series: DashboardSummary['financeSeries'] }) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Finance</CardTitle>
          <CardDescription>Yearly report overview</CardDescription>
        </div>
        <CardOptionsButton label="Finance" />
      </CardHeader>
      <CardContent>
        <ChartContainer config={financeChartConfig} className="h-[240px] w-full">
          <BarChart data={series} barSize={10}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="previous" stackId="a" fill="var(--color-previous)" />
            <Bar dataKey="current" stackId="a" fill="var(--color-current)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function ReportSummaryCard({ report }: { report: DashboardSummary['report'] }) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Report</CardTitle>
          <CardDescription>{report.monthlyAverage}</CardDescription>
        </div>
        <CardOptionsButton label="Report" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <ul className="flex flex-col gap-4">
          {report.metrics.map((metric) => {
            const MetricIcon = REPORT_ICONS[metric.id] ?? Coins
            return (
              <li key={metric.id} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MetricIcon className="size-4" />
                </span>
                <div>
                  <p className="text-xs font-medium">{metric.label}</p>
                  <p className="text-xs text-muted-foreground">{metric.amount}</p>
                </div>
              </li>
            )
          })}
        </ul>
        <Button className="mt-auto w-full">View Report</Button>
      </CardContent>
    </Card>
  )
}