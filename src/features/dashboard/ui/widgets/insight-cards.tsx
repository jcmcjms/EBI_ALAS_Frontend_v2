import {
  ArrowDownRight,
  ArrowUpRight,
  DeviceMobile,
  DotsThreeVertical,
  GameController,
  Headphones,
  Laptop,
  Monitor,
  Table,
  Watch,
  type Icon,
} from '@phosphor-icons/react'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Progress } from '@/shared/ui/progress'
import { cn } from 'cn'
import type { DashboardSummary, ProductIconKey } from '../../api/dashboard-types'
import { DeltaIndicator } from './metric-cards'

const PRODUCT_ICONS: Record<ProductIconKey, Icon> = {
  phone: DeviceMobile,
  laptop: Laptop,
  headphones: Headphones,
  monitor: Monitor,
  watch: Watch,
  tablet: Table,
  game: GameController,
}

export function VisitorsCard({ visitors }: { visitors: DashboardSummary['visitors'] }) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Total visitors</CardTitle>
          <CardDescription>Overall traffic</CardDescription>
        </div>
        <Button variant="outline" size="xs">
          Details
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-semibold">{visitors.total}</p>
          <DeltaIndicator deltaPercent={visitors.deltaPercent} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {visitors.segments.map((segment) => {
            const TrendIcon = segment.trend === 'up' ? ArrowUpRight : ArrowDownRight
            return (
              <div key={segment.device} className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">{segment.device}</p>
                <p className="text-lg font-semibold">{segment.sharePercent}%</p>
                <Progress value={segment.sharePercent} className="h-2.5" />
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {segment.sessions}
                  <TrendIcon className="size-3" />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

interface TopProductsCardProps {
  title: string
  items: DashboardSummary['topProductsBySales']
  showDelta?: boolean
}

export function TopProductsCard({ title, items, showDelta = false }: TopProductsCardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button variant="ghost" size="icon-xs" aria-label={`${title} options`}>
          <DotsThreeVertical className="size-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {items.map((item) => {
            const ProductIcon = PRODUCT_ICONS[item.icon]
            return (
              <li key={item.id} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-none bg-muted text-muted-foreground">
                  <ProductIcon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.brand}</p>
                </div>
                <p className="text-xs font-medium">{item.value}</p>
                {showDelta && item.deltaPercent !== undefined && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      'w-14 justify-center',
                      item.deltaPercent >= 0
                        ? 'bg-primary/10 text-primary'
                        : 'bg-destructive/10 text-destructive'
                    )}
                  >
                    {`${item.deltaPercent >= 0 ? '+' : ''}${item.deltaPercent}%`}
                  </Badge>
                )}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}