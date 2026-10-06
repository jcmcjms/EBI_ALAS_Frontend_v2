import {
  ArrowSquareOut,
  Bank,
  CalendarCheck,
  Certificate,
  ChartBar,
  ChartLineUp,
  ChartPieSlice,
  Coins,
  CreditCard,
  CurrencyBtc,
  Money,
  Notebook,
  Percent,
  PiggyBank,
  ShieldCheck,
  TrendUp,
  Vault,
  type Icon,
} from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar'

interface NavItem {
  title: string
  icon: Icon
  to?: string
  external?: boolean
}

interface NavSection {
  label: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Dashboard',
    items: [
      { title: 'Finance', icon: ChartPieSlice, to: '/dashboard' },
      { title: 'Cash Flow', icon: Money },
      { title: 'Net Worth', icon: Bank },
    ],
  },
  {
    label: 'Pages',
    items: [{ title: 'Landing Page', icon: ChartLineUp, external: true }],
  },
  {
    label: 'Payments',
    items: [{ title: 'Transactions', icon: Coins }],
  },
  {
    label: 'Money Management & Behaviour',
    items: [
      { title: 'Monthly Analytics', icon: ChartBar },
      { title: 'Budget', icon: Notebook },
    ],
  },
  {
    label: 'Accounts & Card Management',
    items: [
      { title: 'Accounts', icon: Vault },
      { title: 'Cards', icon: CreditCard },
    ],
  },
  {
    label: 'Investments',
    items: [
      { title: 'Equities', icon: TrendUp },
      { title: 'F&O', icon: Percent },
      { title: 'Crypto', icon: CurrencyBtc },
      { title: 'Mutual Funds', icon: PiggyBank },
      { title: 'Bonds and Treasury bills', icon: Certificate },
    ],
  },
  {
    label: 'Insurance Premiums & EMIs',
    items: [
      { title: 'Insurance Premiums', icon: ShieldCheck },
      { title: 'EMIs', icon: CalendarCheck },
    ],
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex-row items-center gap-2 px-4 py-3">
        <img
          src="/enterprise_bank-logo.png"
          alt="Enterprise Bank Inc."
          className="h-6 object-contain"
        />
        <span className="text-sm font-semibold tracking-tight">ALAS (CL)</span>
      </SidebarHeader>
      <SidebarContent>
        {NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={!!item.to}
                      isActive={item.to === '/dashboard'}
                      /* TODO: wire remaining items as their routes/features land */
                    >
                      {item.to ? (
                        <Link to={item.to}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      ) : (
                        <button type="button">
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                          {item.external && (
                            <ArrowSquareOut className="ml-auto size-3.5 text-muted-foreground" />
                          )}
                        </button>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}