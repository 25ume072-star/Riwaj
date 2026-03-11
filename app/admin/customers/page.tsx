"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CSSProperties } from "react";

type Order = {
id: string;
user_id: string | null;
total: number | null;
created_at: string;
profiles: {
name: string | null;
email: string | null;
phone: string | null;
} | null;
addresses: {
address_line1: string | null;
city: string | null;
state: string | null;
pincode: string | null;
} | null;
};

type Customer = {
user_id: string;
name: string | null;
email: string | null;
phone: string | null;
address: string | null;
orders: number;
totalSpent: number;
lastOrder: string | null;
};

export default function AdminCustomersPage() {
const supabase = createClient();

const ADMIN_EMAIL = "[storeriwaj@gmail.com](mailto:storeriwaj@gmail.com)";

const [userEmail, setUserEmail] = useState<string | null>(null);
const [customers, setCustomers] = useState<Customer[]>([]);
const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);

const checkAdmin = async () => {
const { data } = await supabase.auth.getUser();
setUserEmail(data.user?.email ?? null);
};

const fetchCustomers = async () => {
const { data, error } = await supabase
.from("orders")
.select(`         id,
        user_id,
        total,
        created_at,
        profiles(name,email,phone),
        addresses!orders_address_id_fkey(
          address_line1,
          city,
          state,
          pincode
        )
      `);


if (error) {
  console.error(error);
  return;
}

const orderList = (data as Order[]) || [];
const map = new Map<string, Customer>();

orderList.forEach((order) => {
  if (!order.user_id) return;

  if (!map.has(order.user_id)) {
    map.set(order.user_id, {
      user_id: order.user_id,
      name: order.profiles?.name ?? null,
      email: order.profiles?.email ?? null,
      phone: order.profiles?.phone ?? null,
      address: order.addresses
        ? `${order.addresses.address_line1 ?? ""}, ${order.addresses.city ?? ""}, ${order.addresses.state ?? ""} ${order.addresses.pincode ?? ""}`
        : null,
      orders: 0,
      totalSpent: 0,
      lastOrder: null,
    });
  }

  const customer = map.get(order.user_id)!;

  customer.orders += 1;
  customer.totalSpent += order.total ?? 0;

  if (
    !customer.lastOrder ||
    new Date(order.created_at) > new Date(customer.lastOrder)
  ) {
    customer.lastOrder = order.created_at;
  }
});

setCustomers(Array.from(map.values()));
setOrders(orderList);
setLoading(false);


};

useEffect(() => {
checkAdmin();
fetchCustomers();
}, []);

if (!userEmail) {
return <div style={{ padding: "40px" }}>Checking access...</div>;
}

if (userEmail !== ADMIN_EMAIL) {
return <div style={{ padding: "40px" }}>Not Authorized</div>;
}

if (loading) {
return <div style={{ padding: "40px" }}>Loading customers...</div>;
}

return ( <div style={container}> <h1 style={title}>Customers</h1>

```
  <div style={table}>
    <div style={tableHeader}>
      <span>Name</span>
      <span>Email</span>
      <span>Phone</span>
      <span>Address</span>
      <span>Orders</span>
      <span>Total Spent</span>
      <span>Last Order</span>
      <span>Action</span>
    </div>

    {customers.map((customer) => (
      <div key={customer.user_id}>
        <div style={tableRow}>
          <span>{customer.name ?? "Unknown"}</span>

          <span>{customer.email ?? "-"}</span>

          <span>{customer.phone ?? "-"}</span>

          <span>{customer.address ?? "-"}</span>

          <span>{customer.orders}</span>

          <span>₹{customer.totalSpent}</span>

          <span>
            {customer.lastOrder
              ? new Date(customer.lastOrder).toLocaleDateString()
              : "-"}
          </span>

          <button
            style={viewButton}
            onClick={() =>
              setExpandedCustomer(
                expandedCustomer === customer.user_id
                  ? null
                  : customer.user_id
              )
            }
          >
            View Orders
          </button>
        </div>

        {expandedCustomer === customer.user_id && (
          <div style={orderBox}>
            <h3>Orders</h3>

            {orders
              .filter((o) => o.user_id === customer.user_id)
              .map((order) => (
                <div key={order.id} style={orderRow}>
                  <span>Order #{order.id}</span>
                  <span>₹{order.total ?? 0}</span>
                  <span>
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
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

const container: CSSProperties = {
padding: "10px",
};

const title: CSSProperties = {
fontSize: "30px",
marginBottom: "20px",
};

const table: CSSProperties = {
border: "1px solid #ddd",
borderRadius: "10px",
overflow: "hidden",
};

const tableHeader: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1.5fr 1fr 2fr 0.8fr 1fr 1fr 1fr",
background: "#f5f5f5",
padding: "12px",
fontWeight: "bold",
};

const tableRow: CSSProperties = {
display: "grid",
gridTemplateColumns: "1fr 1.5fr 1fr 2fr 0.8fr 1fr 1fr 1fr",
padding: "12px",
borderTop: "1px solid #eee",
alignItems: "center",
};

const viewButton: CSSProperties = {
background: "#2563eb",
color: "#fff",
border: "none",
padding: "6px 10px",
borderRadius: "6px",
cursor: "pointer",
};

const orderBox: CSSProperties = {
padding: "15px",
background: "#fafafa",
borderTop: "1px solid #eee",
};

const orderRow: CSSProperties = {
display: "flex",
justifyContent: "space-between",
marginBottom: "8px",
};
