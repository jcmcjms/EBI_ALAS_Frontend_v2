import { Skeleton } from '@/shared/ui/skeleton'
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar'
import { useDashboardSummary } from '../api/dashboard-queries'
import { AppSidebar } from './app-sidebar'
import { DashboardHeader } from './dashboard-header'
import { FinanceChartCard, ReportSummaryCard } from './widgets/overview-cards'
import { ImpressionCard, MetricStatCard, RevenueTrendCard } from './widgets/metric-cards'
import { TopProductsCard, VisitorsCard } from './widgets/insight-cards'

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-72 w-full" />
      ))}
    </div>
  )
}

export function DashboardPage() {
  const { data: summary, isLoading } = useDashboardSummary()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {isLoading || !summary ? (
            <DashboardSkeleton />
          ) : (
            <>
              <section className="grid gap-4 xl:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,4fr)]">
                <FinanceChartCard series={summary.financeSeries} />
                <ReportSummaryCard report={summary.report} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricStatCard variant="orders" stat={summary.orders} />
                  <MetricStatCard variant="profit" stat={summary.profit} />
                  <RevenueTrendCard revenue={summary.revenue} />
                  <ImpressionCard impression={summary.impression} />
                </div>
              </section>
              <section className="grid gap-4 xl:grid-cols-3">
                <VisitorsCard visitors={summary.visitors} />
                <TopProductsCard title="Top Products by Sales" items={summary.topProductsBySales} />
                <TopProductsCard
                  title="Top Products by Volume"
                  items={summary.topProductsByVolume}
                  showDelta
                />
              </section>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}