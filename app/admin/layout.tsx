"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={container}>
      <aside style={sidebar}>
        <h2 style={logo}>Riwaj Admin</h2>

        <nav style={nav}>
          <Link href="/admin" style={navItem}>
            Dashboard
          </Link>

          <Link href="/admin/orders" style={navItem}>
            Orders
          </Link>

          <Link href="/admin/products" style={navItem}>
            Products
          </Link>

          <Link href="/admin/customers" style={navItem}>
            Customers
          </Link>
        </nav>
      </aside>

      <main style={mainContent}>{children}</main>
    </div>
  );
}

const container: CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  background: "#f5f5f5",
};

const sidebar: CSSProperties = {
  width: "220px",
  background: "#111",
  color: "#fff",
  padding: "25px",
};

const logo: CSSProperties = {
  fontSize: "20px",
  marginBottom: "30px",
};

const nav: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const navItem: CSSProperties = {
  color: "#fff",
  textDecoration: "none",
  fontSize: "16px",
};

const mainContent: CSSProperties = {
  flex: 1,
  padding: "40px",
};