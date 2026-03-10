"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/database.types";
import type { CSSProperties } from "react";

export default function AdminPage() {
  const supabase = createClient();

  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = "storeriwaj@gmail.com";

  const checkAdmin = async () => {
    const { data } = await supabase.auth.getUser();
    setUserEmail(data.user?.email ?? null);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setProducts((data as Product[]) || []);
    }
  };

  useEffect(() => {
    checkAdmin();
    fetchProducts();
  }, []);

  const handleFileChange = (file: File | null) => {
    setFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const createSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  const addProduct = async () => {
    if (!name || !price || !category || !file) {
      alert("Please fill all fields");
      return;
    }

    const numericPrice = parseFloat(price);

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      alert("Invalid price");
      return;
    }

    setLoading(true);

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      setLoading(false);
      return;
    }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;

    const slug = createSlug(name);

    const { error } = await supabase.from("products").insert([
      {
        name,
        price: numericPrice,
        category,
        image_url: imageUrl,
        slug,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      alert("Product added successfully!");

      setName("");
      setPrice("");
      setCategory("");
      setFile(null);
      setPreview(null);

      fetchProducts();
    }

    setLoading(false);
  };

  const deleteProduct = async (product: Product) => {
    if (!confirm("Delete this product?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      alert(error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  const editProduct = async (product: Product) => {
    const newPriceInput = prompt("Enter new price", String(product.price));

    if (!newPriceInput) return;

    const newPrice = parseFloat(newPriceInput);

    if (Number.isNaN(newPrice) || newPrice <= 0) {
      alert("Invalid price");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({ price: newPrice })
      .eq("id", product.id);

    if (error) {
      alert(error.message);
    } else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, price: newPrice } : p
        )
      );
    }
  };

  if (userEmail !== ADMIN_EMAIL) {
    return <div style={{ padding: "40px" }}>Not Authorized</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Riwaj Admin Panel</h1>

      <div style={formBox}>
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyle}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Category</option>
          <option value="sarees">Sarees</option>
          <option value="lehengas">Lehengas</option>
          <option value="poshaks">Poshaks</option>
          <option value="kurtis">Kurtis</option>
          <option value="accessories">Accessories</option>
        </select>

        <input
          type="file"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          style={{ marginBottom: "15px" }}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{ width: "120px", borderRadius: "8px", marginBottom: "10px" }}
          />
        )}

        <button onClick={addProduct} style={primaryButton}>
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </div>

      <h2 style={{ marginTop: "40px" }}>Products</h2>

      <div style={grid}>
        {products.map((p) => (
          <div key={p.id} style={cardStyle}>
            <img src={p.image_url ?? ""} alt={p.name} style={imageStyle} />

            <h3>{p.name}</h3>
            <p style={{ fontWeight: "bold" }}>₹{p.price}</p>
            <p style={{ fontSize: "14px", color: "#555" }}>{p.category}</p>

            <button
              onClick={() => editProduct(p)}
              style={{ ...primaryButton, marginRight: "8px" }}
            >
              Edit
            </button>
            

            <button onClick={() => deleteProduct(p)} style={dangerButton}>
              Delete
            </button>
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

const formBox: CSSProperties = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "10px",
};

const inputStyle: CSSProperties = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const primaryButton: CSSProperties = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const dangerButton: CSSProperties = {
  background: "#b91c1c",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
  gap: "20px",
  marginTop: "20px",
};

const cardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "15px",
  background: "#fff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const imageStyle: CSSProperties = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "8px",
};