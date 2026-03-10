"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CSSProperties } from "react";

export default function AdminDashboard() {
  const supabase = createClient();

  const ADMIN_EMAIL = "storeriwaj@gmail.com";

  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const checkAdmin = async () => {
    const { data } = await supabase.auth.getUser();
    setUserEmail(data.user?.email ?? null);
  };

  const fetchStats = async () => {
    const { data: orders } = await supabase.from("orders").select("*");

    const { data: products } = await supabase.from("products").select("*");

    if (orders) {
      setTotalOrders(orders.length);

      const revenue = orders.reduce(
        (sum: number, order: any) => sum + (order.total ?? 0),
        0
      );

      setTotalRevenue(revenue);
    }

    if (products) {
      setTotalProducts(products.length);
    }
  };

  useEffect(() => {
    checkAdmin();
    fetchStats();
  }, []);

  if (!userEmail) {
    return <div style={{ padding: "40px" }}>Checking access...</div>;
  }

  if (userEmail !== ADMIN_EMAIL) {
    return <div style={{ padding: "40px" }}>Not Authorized</div>;
  }

  return (
    <div style={container}>
      <h1 style={title}>Admin Dashboard</h1>

      <div style={statsGrid}>
        <div style={statCard}>
          <h3>Total Orders</h3>
          <p style={statNumber}>{totalOrders}</p>
        </div>

        <div style={statCard}>
          <h3>Total Products</h3>
          <p style={statNumber}>{totalProducts}</p>
        </div>

        <div style={statCard}>
          <h3>Total Revenue</h3>
          <p style={statNumber}>₹{totalRevenue}</p>
        </div>
      </div>

      <div style={infoBox}>
        <h2>Welcome to the Riwaj Admin Panel</h2>
        <p>
          Use the sidebar to manage products, view orders, and monitor your
          store activity.
        </p>
      </div>
    </div>
  );
}

const container: CSSProperties = {
  padding: "10px",
};

const title: CSSProperties = {
  fontSize: "32px",
  marginBottom: "30px",
};

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: "20px",
  marginBottom: "40px",
};

const statCard: CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const statNumber: CSSProperties = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "10px",
};

const infoBox: CSSProperties = {
  background: "#fff",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};