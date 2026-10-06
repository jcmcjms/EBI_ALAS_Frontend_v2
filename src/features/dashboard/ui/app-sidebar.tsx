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

const ACTIVE_PATH = '/dashboard'

// Finora reference: tinted active row driven by preset tokens, not hardcoded green.
const ACTIVE_CLASSES =
	'data-[active=true]:bg-primary/10 data-[active=true]:text-primary'

const NAV_SECTIONS: NavSection[] = [
	{
		label: 'Dashboard',
		items: [
			{ title: 'Finance', icon: ChartPieSlice, to: '/dashboard' },
			{ title: 'Cash Flow', icon: Money },
			{ title: 'Net Worth', icon: Bank },
		],
	},
	{ label: 'Pages', items: [{ title: 'Landing Page', icon: ChartLineUp, external: true }] },
	{ label: 'Payments', items: [{ title: 'Transactions', icon: Coins }] },
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
						<SidebarGroupLabel className="text-[11px] uppercase tracking-wider">
							{section.label}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{section.items.map((item) => {
									const isActive = item.to === ACTIVE_PATH
									return (
										<SidebarMenuItem key={item.title}>
											{item.to ? (
												<SidebarMenuButton
													asChild
													isActive={isActive}
													className={ACTIVE_CLASSES}
												>
													<Link to={item.to}>
														<item.icon className="size-4" />
														<span>{item.title}</span>
													</Link>
												</SidebarMenuButton>
											) : (
												/* Single flex button — icon and label as direct children.
												   TODO: swap to <Link asChild> as each route lands. */
												<SidebarMenuButton isActive={false} className={ACTIVE_CLASSES}>
													<item.icon className="size-4" />
													<span>{item.title}</span>
													{item.external && (
														<ArrowSquareOut className="ml-auto size-3.5 text-muted-foreground" />
													)}
												</SidebarMenuButton>
											)}
										</SidebarMenuItem>
									)
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
		</Sidebar>
	)
}