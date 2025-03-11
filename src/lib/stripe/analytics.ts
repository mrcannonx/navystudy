import stripe, { isServer } from './core';
import { Stripe } from 'stripe';

/**
 * Get financial metrics for the admin dashboard
 */
export async function getFinancialMetrics() {
  if (!isServer || !stripe) {
    throw new Error('This function can only be called on the server side');
  }

  try {
    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      status: 'active',
      expand: ['data.customer', 'data.plan.product'],
      limit: 100,
    });

    // Get all customers
    const customers = await stripe.customers.list({
      limit: 100,
    });

    // Get recent invoices
    const invoices = await stripe.invoices.list({
      limit: 100,
      expand: ['data.customer', 'data.subscription'],
    });

    // Get upcoming invoices for the next 30 days
    const thirtyDaysFromNow = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);
    const upcomingInvoices = invoices.data.filter(invoice => 
      invoice.due_date && invoice.due_date <= thirtyDaysFromNow && invoice.status === 'open'
    );

    // Calculate MRR (Monthly Recurring Revenue)
    const mrr = subscriptions.data.reduce((total, subscription) => {
      // Get the first item from the subscription (most subscriptions have only one item)
      const item = subscription.items.data[0];
      if (!item) return total;
      
      const price = item.price;
      
      // Convert to monthly amount if yearly
      if (price.recurring?.interval === 'year') {
        return total + (price.unit_amount || 0) / 12;
      }
      return total + (price.unit_amount || 0);
    }, 0) / 100; // Convert from cents to dollars

    // Calculate churn rate (simplified)
    // For a more accurate calculation, you would need historical data
    const canceledSubscriptions = await stripe.subscriptions.list({
      status: 'canceled',
      created: {
        // Subscriptions canceled in the last 30 days
        gte: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60),
      },
      limit: 100,
    });
    
    const churnRate = customers.data.length > 0 
      ? (canceledSubscriptions.data.length / customers.data.length) * 100 
      : 0;

    // Calculate conversion rate (simplified)
    // This assumes all customers with active subscriptions have converted
    const conversionRate = customers.data.length > 0 
      ? (subscriptions.data.length / customers.data.length) * 100 
      : 0;

    // Calculate current month revenue
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    
    const currentMonthInvoices = invoices.data.filter(invoice => 
      invoice.status === 'paid' && 
      invoice.created >= Math.floor(currentMonthStart.getTime() / 1000)
    );
    
    const currentMonthRevenue = currentMonthInvoices.reduce((total, invoice) => 
      total + (invoice.amount_paid || 0), 0) / 100;

    // Calculate previous month revenue
    const previousMonthStart = new Date();
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
    previousMonthStart.setDate(1);
    previousMonthStart.setHours(0, 0, 0, 0);
    
    const previousMonthEnd = new Date(currentMonthStart);
    previousMonthEnd.setSeconds(previousMonthEnd.getSeconds() - 1);
    
    const previousMonthInvoices = invoices.data.filter(invoice => 
      invoice.status === 'paid' && 
      invoice.created >= Math.floor(previousMonthStart.getTime() / 1000) && 
      invoice.created <= Math.floor(previousMonthEnd.getTime() / 1000)
    );
    
    const previousMonthRevenue = previousMonthInvoices.reduce((total, invoice) => 
      total + (invoice.amount_paid || 0), 0) / 100;

    // Calculate year-to-date revenue
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const ytdInvoices = invoices.data.filter(invoice => 
      invoice.status === 'paid' && 
      invoice.created >= Math.floor(yearStart.getTime() / 1000)
    );
    
    const ytdRevenue = ytdInvoices.reduce((total, invoice) => 
      total + (invoice.amount_paid || 0), 0) / 100;

    // Calculate average revenue per user
    const arpu = subscriptions.data.length > 0 
      ? mrr / subscriptions.data.length 
      : 0;

    // Format subscription data for display
    const formattedSubscriptions = subscriptions.data.map(subscription => {
      const customer = subscription.customer as Stripe.Customer;
      // Get the first item from the subscription
      const item = subscription.items.data[0];
      const price = item?.price;
      const product = price?.product as Stripe.Product;
      
      return {
        id: subscription.id,
        user: customer.name || customer.email || 'Unknown',
        email: customer.email || 'Unknown',
        plan: product?.name || price?.nickname || 'Unknown',
        amount: (price?.unit_amount || 0) / 100,
        interval: price?.recurring?.interval || 'month',
        status: subscription.status,
        created: new Date(subscription.created * 1000).toISOString(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      };
    });

    // Format payment history
    const formattedPayments = invoices.data
      .filter(invoice => invoice.status === 'paid')
      .map(invoice => {
        const customer = invoice.customer as Stripe.Customer;
        return {
          id: invoice.id,
          user: customer.name || customer.email || 'Unknown',
          email: customer.email || 'Unknown',
          amount: (invoice.amount_paid || 0) / 100,
          date: new Date(invoice.created * 1000).toISOString(),
          status: invoice.status || null,
          description: invoice.description || 'Subscription payment',
        };
      });

    // Format upcoming invoices
    const formattedUpcomingInvoices = upcomingInvoices.map(invoice => {
      const customer = invoice.customer as Stripe.Customer;
      return {
        id: invoice.id,
        user: customer.name || customer.email || 'Unknown',
        email: customer.email || 'Unknown',
        amount: (invoice.amount_due || 0) / 100,
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : 'Unknown',
        description: invoice.description || 'Upcoming payment',
      };
    });

    return {
      activeSubscriptions: subscriptions.data.length,
      mrr,
      conversionRate,
      churnRate,
      currentMonthRevenue,
      previousMonthRevenue,
      revenueGrowth: previousMonthRevenue > 0 
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
        : 100,
      ytdRevenue,
      arpu,
      subscriptions: formattedSubscriptions,
      payments: formattedPayments,
      upcomingInvoices: formattedUpcomingInvoices,
    };
  } catch (error) {
    console.error('Error fetching financial metrics:', error);
    throw error;
  }
}
