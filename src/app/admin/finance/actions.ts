'use server'

import { getFinancialMetrics } from "@/lib/stripe"

export async function fetchFinancialMetrics() {
  try {
    const metrics = await getFinancialMetrics()
    return { success: true, data: metrics }
  } catch (error) {
    console.error('Error fetching financial metrics:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      // Return mock data as fallback for development
      data: {
        activeSubscriptions: 5,
        mrr: 84,
        conversionRate: 15,
        churnRate: 5,
        currentMonthRevenue: 488,
        previousMonthRevenue: 428,
        revenueGrowth: 14,
        ytdRevenue: 3264,
        arpu: 20,
        subscriptions: [
          { id: 'sub_123', user: 'John Smith', email: 'john@example.com', plan: 'Monthly', amount: 20, interval: 'month', status: 'active', created: '2025-01-15T00:00:00.000Z', currentPeriodEnd: '2025-03-15T00:00:00.000Z' },
          { id: 'sub_124', user: 'Sarah Johnson', email: 'sarah@example.com', plan: 'Yearly', amount: 204, interval: 'year', status: 'active', created: '2024-11-20T00:00:00.000Z', currentPeriodEnd: '2025-11-20T00:00:00.000Z' },
          { id: 'sub_125', user: 'Michael Brown', email: 'michael@example.com', plan: 'Monthly', amount: 20, interval: 'month', status: 'past_due', created: '2025-02-01T00:00:00.000Z', currentPeriodEnd: '2025-03-01T00:00:00.000Z' },
          { id: 'sub_126', user: 'Emily Davis', email: 'emily@example.com', plan: 'Yearly', amount: 204, interval: 'year', status: 'canceled', created: '2024-08-10T00:00:00.000Z', currentPeriodEnd: '2025-08-10T00:00:00.000Z' },
          { id: 'sub_127', user: 'David Wilson', email: 'david@example.com', plan: 'Monthly', amount: 20, interval: 'month', status: 'active', created: '2025-02-25T00:00:00.000Z', currentPeriodEnd: '2025-03-25T00:00:00.000Z' },
        ],
        payments: [
          { id: 'pay_001', user: 'John Smith', email: 'john@example.com', amount: 20, date: '2025-03-01T00:00:00.000Z', status: 'paid', description: 'Monthly subscription' },
          { id: 'pay_002', user: 'Sarah Johnson', email: 'sarah@example.com', amount: 204, date: '2024-11-20T00:00:00.000Z', status: 'paid', description: 'Yearly subscription' },
          { id: 'pay_003', user: 'Michael Brown', email: 'michael@example.com', amount: 20, date: '2025-02-01T00:00:00.000Z', status: 'failed', description: 'Monthly subscription' },
          { id: 'pay_004', user: 'Emily Davis', email: 'emily@example.com', amount: 204, date: '2024-08-10T00:00:00.000Z', status: 'paid', description: 'Yearly subscription' },
          { id: 'pay_005', user: 'David Wilson', email: 'david@example.com', amount: 20, date: '2025-02-25T00:00:00.000Z', status: 'paid', description: 'Monthly subscription' },
          { id: 'pay_006', user: 'John Smith', email: 'john@example.com', amount: 20, date: '2025-02-01T00:00:00.000Z', status: 'paid', description: 'Monthly subscription' },
          { id: 'pay_007', user: 'David Wilson', email: 'david@example.com', amount: 20, date: '2025-01-25T00:00:00.000Z', status: null, description: 'Monthly subscription' },
        ],
        upcomingInvoices: [
          { id: 'inv_001', user: 'John Smith', email: 'john@example.com', amount: 20, dueDate: '2025-03-15T00:00:00.000Z', description: 'Monthly subscription' },
          { id: 'inv_002', user: 'David Wilson', email: 'david@example.com', amount: 20, dueDate: '2025-03-25T00:00:00.000Z', description: 'Monthly subscription' },
        ]
      }
    }
  }
}
