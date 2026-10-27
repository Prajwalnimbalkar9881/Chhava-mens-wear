import { createClient } from '@supabase/supabase-js';
import { Order, Product, OrderStatus } from '../types';

// User's Supabase Project Credentials
export const SUPABASE_PROJECT_ID = 'xmyhiwpoxkficfrqdoxz';
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || `https://${SUPABASE_PROJECT_ID}.supabase.co`;
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_4gCEzLLm_5bCZRlpPVBkJA_zCg5GSSO';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Check if Supabase connection is responding
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from('orders').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message?.includes('relation "orders" does not exist')) {
        return {
          success: true,
          message:
            'Connected to Supabase! The "orders" table needs to be created in your SQL Editor.',
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected to Supabase successfully!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection failed' };
  }
}

/**
 * Save customer order to Supabase
 */
export async function saveOrderToSupabase(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: order.id,
      order_number: order.orderNumber,
      created_at: order.createdAt,
      customer_name: order.customer.fullName,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      address_line: order.customer.addressLine,
      landmark: order.customer.landmark || '',
      city: order.customer.city,
      state: order.customer.state,
      pincode: order.customer.pincode,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      coupon_code: order.couponCode || '',
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      status: order.status,
      tracking_number: order.trackingNumber || '',
      tracking_events: order.trackingEvents || [],
    };

    const { error } = await supabase.from('orders').upsert([payload]);

    if (error) {
      console.warn('[Supabase] Note saving order:', error.message);
      return { success: false, error: error.message };
    }

    console.log('[Supabase] Customer order successfully synced:', order.orderNumber);
    return { success: true };
  } catch (err: any) {
    console.warn('[Supabase] Order sync error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch customer orders from Supabase
 */
export async function fetchOrdersFromSupabase(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase] Fetch orders notice:', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    // Map database snake_case columns back to Order interface
    return data.map((row: any): Order => ({
      id: row.id,
      orderNumber: row.order_number,
      createdAt: row.created_at,
      customer: {
        fullName: row.customer_name,
        email: row.customer_email,
        phone: row.customer_phone,
        addressLine: row.address_line,
        landmark: row.landmark,
        city: row.city,
        state: row.state,
        pincode: row.pincode,
      },
      items: row.items || [],
      subtotal: Number(row.subtotal),
      discount: Number(row.discount || 0),
      couponCode: row.coupon_code || undefined,
      shipping: Number(row.shipping || 0),
      tax: Number(row.tax || 0),
      total: Number(row.total),
      paymentMethod: row.payment_method,
      paymentStatus: row.payment_status,
      status: row.status,
      trackingNumber: row.tracking_number,
      trackingEvents: row.tracking_events || [],
    }));
  } catch (err) {
    console.warn('[Supabase] Fetch error:', err);
    return null;
  }
}

/**
 * Update order fulfillment status in Supabase
 */
export async function updateOrderStatusInSupabase(
  orderId: string,
  status: OrderStatus,
  trackingEvents: any[],
  paymentStatus?: string
): Promise<boolean> {
  try {
    const updates: any = {
      status,
      tracking_events: trackingEvents,
    };
    if (paymentStatus) {
      updates.payment_status = paymentStatus;
    }

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId);

    if (error) {
      console.warn('[Supabase] Order status update notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Update status error:', err);
    return false;
  }
}

/**
 * Save new product to Supabase
 */
export async function saveProductToSupabase(product: Product): Promise<boolean> {
  try {
    const payload = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      tagline: product.tagline || '',
      description: product.description,
      fabric: product.fabric,
      fit: product.fit,
      care: product.care,
      category_slug: product.category,
      price: product.price,
      discount_price: product.discountPrice || null,
      images: product.images,
      colors: product.colors,
      sizes: product.sizes,
      is_new_arrival: !!product.isNewArrival,
      is_best_seller: !!product.isBestSeller,
      is_featured: !!product.isFeatured,
      rating: product.rating || 5.0,
      review_count: product.reviewCount || 0,
      created_at: product.createdAt,
    };

    const { error } = await supabase.from('products').upsert([payload]);
    if (error) {
      console.warn('[Supabase] Product save note:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Product save error:', err);
    return false;
  }
}
