"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CSSProperties } from "react";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
  products: {
    name: string;
    image_url: string | null;
  } | null;
};

type Order = {
  id: number;
  status: string | null;
  payment_status: string | null;
  total: number | null;
  subtotal: number | null;
  shipping: number | null;
  created_at: string;
  user_id: string | null;
  order_items: OrderItem[];
};

export default function AdminOrdersPage() {
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = "storeriwaj@gmail.com";
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const checkAdmin = async () => {
    const { data } = await supabase.auth.getUser();
    setUserEmail(data.user?.email ?? null);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          size,
          color,
          products (
            name,
            image_url
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setOrders((data as Order[]) || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    checkAdmin();
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: number, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      alert(error.message);
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  if (!userEmail) {
    return <div style={{ padding: "40px" }}>Checking access...</div>;
  }

  if (userEmail !== ADMIN_EMAIL) {
    return <div style={{ padding: "40px" }}>Not Authorized</div>;
  }

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading orders...</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Orders Dashboard</h1>

      <div style={tableStyle}>
        <div style={tableHeader}>
          <span>Order ID</span>
          <span>Total</span>
          <span>Status</span>
          <span>Payment</span>
          <span>Date</span>
          <span>Action</span>
        </div>

        {orders.map((order) => (
          <div key={order.id}>
            <div style={tableRow}>
              <span>#{order.id}</span>
              <span>₹{order.total ?? 0}</span>

              <span>
                <select
                  value={order.status ?? "Pending"}
                  onChange={(e) =>
                    updateStatus(order.id, e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </span>

              <span>{order.payment_status ?? "pending"}</span>

              <span>
                {new Date(order.created_at).toLocaleDateString()}
              </span>

              <button
                style={viewButton}
                onClick={() =>
                  setExpandedOrder(
                    expandedOrder === order.id ? null : order.id
                  )
                }
              >
                View
              </button>
            </div>

            {expandedOrder === order.id && (
              <div style={orderDetails}>
                <h3>Items</h3>

                {order.order_items.map((item) => (
                  <div key={item.id} style={itemRow}>
                    <img
                      src={item.products?.image_url ?? ""}
                      alt={item.products?.name ?? "product"}
                      style={productImage}
                    />

                    <div>
                      <p style={{ fontWeight: "bold" }}>
                        {item.products?.name}
                      </p>

                      <p>Qty: {item.quantity}</p>

                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Color: {item.color}</p>}

                      <p>₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  padding: "40px",
  maxWidth: "1100px",
  margin: "auto",
};

const titleStyle: CSSProperties = {
  fontSize: "30px",
  marginBottom: "20px",
};

const tableStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  overflow: "hidden",
};

const tableHeader: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
  background: "#f5f5f5",
  padding: "12px",
  fontWeight: "bold",
};

const tableRow: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
  padding: "12px",
  borderTop: "1px solid #eee",
  alignItems: "center",
};

const orderDetails: CSSProperties = {
  padding: "20px",
  background: "#fafafa",
  borderTop: "1px solid #eee",
};

const itemRow: CSSProperties = {
  display: "flex",
  gap: "15px",
  marginBottom: "15px",
};

const productImage: CSSProperties = {
  width: "80px",
  height: "80px",
  objectFit: "cover",
  borderRadius: "6px",
};

const viewButton: CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};