"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  CreditCard,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  BarChart
} from "lucide-react"
import { formatDistanceToNow, format } from 'date-fns'
import { fetchFinancialMetrics } from "./actions"

// Define types for financial data
type SubscriptionData = {
  id: string;
  user: string;
  email: string;
  plan: string;
  amount: number;
  interval: string;
  status: string;
  created: string;
  currentPeriodEnd: string;
}

type PaymentData = {
  id: string;
  user: string;
  email: string;
  amount: number;
  date: string;
  status: string | null;
  description: string;
}

type UpcomingInvoiceData = {
  id: string;
  user: string;
  email: string;
  amount: number;
  dueDate: string;
  description: string;
}

type FinancialMetrics = {
  activeSubscriptions: number;
  mrr: number;
  conversionRate: number;
  churnRate: number;
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  revenueGrowth: number;
  ytdRevenue: number;
  arpu: number;
  subscriptions: SubscriptionData[];
  payments: PaymentData[];
  upcomingInvoices: UpcomingInvoiceData[];
}

export default function FinancePage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [financialData, setFinancialData] = useState<FinancialMetrics | null>(null)

  // Protect admin route
  useEffect(() => {
    if (!profile?.is_admin) {
      router.push("/")
    }
  }, [profile, router])

  // Fetch financial data
  useEffect(() => {
    async function loadFinancialData() {
      if (profile?.is_admin) {
        try {
          setLoading(true)
          const result = await fetchFinancialMetrics()
          
          if (result.success) {
            setFinancialData(result.data)
          } else {
            setError(result.error || "Failed to load financial data")
            // Still set the fallback data
            setFinancialData(result.data)
          }
        } catch (err) {
          setError("An unexpected error occurred")
          console.error("Error fetching financial data:", err)
        } finally {
          setLoading(false)
        }
      }
    }

    loadFinancialData()
  }, [profile])

  if (!profile?.is_admin) return null
  
  // Show loading state
  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Finance Dashboard</h1>
          <p className="text-gray-500 mt-2">Loading financial data...</p>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  // Calculate revenue by plan type
  const revenueByPlan = {
    monthly: financialData?.subscriptions
      .filter(sub => sub.interval === 'month' && sub.status === 'active')
      .reduce((total, sub) => total + sub.amount, 0) || 0,
    yearly: financialData?.subscriptions
      .filter(sub => sub.interval === 'year' && sub.status === 'active')
      .reduce((total, sub) => total + sub.amount, 0) || 0
  }

  // Calculate plan distribution
  const totalActiveSubscriptions = financialData?.activeSubscriptions || 0
  const monthlySubscriptions = financialData?.subscriptions.filter(sub => sub.interval === 'month' && sub.status === 'active').length || 0
  const yearlySubscriptions = financialData?.subscriptions.filter(sub => sub.interval === 'year' && sub.status === 'active').length || 0
  
  const monthlyPercentage = totalActiveSubscriptions > 0 
    ? Math.round((monthlySubscriptions / totalActiveSubscriptions) * 100) 
    : 0
  
  const yearlyPercentage = totalActiveSubscriptions > 0 
    ? Math.round((yearlySubscriptions / totalActiveSubscriptions) * 100) 
    : 0

  // Calculate projected annual revenue
  const projectedAnnual = (financialData?.mrr || 0) * 12

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Finance Dashboard</h1>
        <p className="text-gray-500 mt-2">Track your subscription revenue and financial metrics</p>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md mt-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{financialData?.activeSubscriptions || 0}</p>
                <span className="text-sm text-green-600">+5%</span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">${financialData?.mrr.toFixed(2) || '0.00'}</p>
                <span className="text-sm text-green-600">+8%</span>
              </div>
            </div>
            <div className="p-2 bg-green-50 rounded-full">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{financialData?.conversionRate.toFixed(1) || '0.0'}%</p>
                <span className="text-sm text-green-600">+2%</span>
              </div>
            </div>
            <div className="p-2 bg-purple-50 rounded-full">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Churn Rate</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{financialData?.churnRate.toFixed(1) || '0.0'}%</p>
                <span className="text-sm text-red-600">-1%</span>
              </div>
            </div>
            <div className="p-2 bg-orange-50 rounded-full">
              <RefreshCcw className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Overview */}
      <Card className="p-6 bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Month</span>
              <span className="font-medium">${financialData?.currentMonthRevenue.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Previous Month</span>
              <span className="font-medium">${financialData?.previousMonthRevenue.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Month-over-Month Growth</span>
              <span className={`font-medium ${financialData?.revenueGrowth && financialData.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {financialData?.revenueGrowth && financialData.revenueGrowth > 0 ? '+' : ''}
                {financialData?.revenueGrowth.toFixed(1) || '0.0'}%
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Year to Date</span>
              <span className="font-medium">${financialData?.ytdRevenue.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Projected Annual</span>
              <span className="font-medium">${projectedAnnual.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Revenue Per User</span>
              <span className="font-medium">${financialData?.arpu.toFixed(2) || '0.00'}/mo</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monthly Plan Revenue</span>
              <span className="font-medium">${revenueByPlan.monthly.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Yearly Plan Revenue</span>
              <span className="font-medium">${revenueByPlan.yearly.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Plan Distribution</span>
              <span className="font-medium">Monthly: {monthlyPercentage}% | Yearly: {yearlyPercentage}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Data */}
      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="subscriptions">Active Subscriptions</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="invoices">Upcoming Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscriptions" className="bg-white dark:bg-gray-800 rounded-md">
          <Table>
            <TableCaption>A list of active subscriptions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Next Billing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData?.subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.user}</TableCell>
                  <TableCell>{subscription.plan} ({subscription.interval})</TableCell>
                  <TableCell>${subscription.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {subscription.status === 'active' && (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      {subscription.status === 'past_due' && (
                        <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                      )}
                      {subscription.status === 'canceled' && (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`capitalize ${
                        subscription.status === 'active' ? 'text-green-600' : 
                        subscription.status === 'past_due' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {subscription.status.replace('_', ' ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(subscription.created).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="payments" className="bg-white dark:bg-gray-800 rounded-md">
          <Table>
            <TableCaption>Recent payment history.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData?.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.user}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {payment.status === 'paid' && (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      {payment.status === 'failed' && (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`capitalize ${
                        payment.status === 'paid' ? 'text-green-600' : 
                        payment.status === 'failed' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {payment.status || 'Unknown'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{payment.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="invoices" className="bg-white dark:bg-gray-800 rounded-md">
          <Table>
            <TableCaption>Upcoming invoices for the next 30 days.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialData?.upcomingInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.user}</TableCell>
                  <TableCell>${invoice.amount}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{invoice.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Stripe Integration</h3>
        <p className="text-blue-700 dark:text-blue-400 mb-4">
          {error 
            ? "Currently showing fallback data due to Stripe API connection issues. Please check your Stripe API key configuration."
            : "This dashboard is connected to your Stripe account and displays real-time subscription and payment data."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
            <h4 className="font-medium mb-2">Monthly Plan</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">$20.00 per month</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md">
            <h4 className="font-medium mb-2">Yearly Plan</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">$204.00 per year (15% discount)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
