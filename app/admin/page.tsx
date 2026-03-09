"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/database.types";

export default function AdminPage() {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setProducts((data as Product[]) || []);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle image preview
  const handleFileChange = (file: File | null) => {
    setFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Add product
  const addProduct = async () => {
    if (!name || !price || !category || !file) {
      alert("Please fill all fields");
      return;
    }

    const numericPrice = parseFloat(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      alert("Please enter a valid numeric price");
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

    const { error } = await supabase.from("products").insert([
      {
        name,
        price: numericPrice,
        category,
        image_url: imageUrl,
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

  // Delete product
  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.log(error);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Edit product price
  const editProduct = async (id: string) => {
    const newPriceInput = prompt("Enter new price");

    if (!newPriceInput) return;

    const newPrice = parseFloat(newPriceInput);
    if (Number.isNaN(newPrice) || newPrice <= 0) {
      alert("Please enter a valid numeric price");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({ price: newPrice })
      .eq("id", id);

    if (error) {
      console.log(error);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
      );
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1000px", margin: "auto" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Admin Product Panel
      </h1>

      {/* Add Product Form */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "40px",
        }}
      >
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

        {/* Category Dropdown */}
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
            src={preview ?? ""}
            style={{
              width: "120px",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          />
        )}

        <br />

        <button onClick={addProduct} style={primaryButton}>
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </div>

      {/* Product Grid */}
      <h2>Products</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {products.map((p) => (
          <div key={p.id} style={cardStyle}>
            <img
              src={p.image_url ?? ""}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />

            <h3>{p.name}</h3>
            <p style={{ fontWeight: "bold" }}>₹{p.price}</p>
            <p style={{ fontSize: "14px", color: "#555" }}>{p.category}</p>

            <button
              onClick={() => editProduct(p.id)}
              style={{ ...primaryButton, marginRight: "8px" }}
            >
              Edit
            </button>

            <button onClick={() => deleteProduct(p.id)} style={dangerButton}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const primaryButton = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const dangerButton = {
  background: "#b91c1c",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "15px",
  background: "#fff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};