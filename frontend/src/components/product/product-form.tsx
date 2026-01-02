import { useState, useEffect } from "react";
import { useProductStore } from "@/stores/useProductStore";
import type { Product } from "@/types/product";

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const { createProduct, updateProduct } = useProductStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [formattedPrice, setFormattedPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(product.price.toString());
      setFormattedPrice(product.price.toLocaleString("vi-VN"));
      setStock(product.stock.toString());
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setFormattedPrice("");
      setStock("");
      setImageFile(null);
    }
  }, [product]);

  const handlePriceChange = (value: string) => {
    const rawValue = value.replace(/\D/g, "");
    setPrice(rawValue);
    setFormattedPrice(rawValue ? Number(rawValue).toLocaleString("vi-VN") : "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return alert("Vui lòng điền đủ thông tin");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    if (imageFile) formData.append("image", imageFile);

    try {
      setSubmitting(true);
      if (product) await updateProduct(product._id, formData);
      else await createProduct(formData);
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="mb-2">
        <label className="form-label fw-bold">Tên sản phẩm</label>
        <input
          className="form-control form-control-sm"
          placeholder="Nhập tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="form-label fw-bold">Giá (₫)</label>
        <input
          className="form-control form-control-sm"
          placeholder="Nhập giá sản phẩm"
          value={formattedPrice}
          onChange={(e) => handlePriceChange(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="form-label fw-bold">Tồn kho</label>
        <input
          className="form-control form-control-sm"
          type="number"
          placeholder="Nhập số lượng tồn kho"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
      </div>
      <div className="mb-2">
        <label className="form-label fw-bold">Ảnh sản phẩm</label>
        <input
          className="form-control form-control-sm"
          type="file"
          accept="image/*"
          placeholder="Chọn ảnh sản phẩm"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>
      <div className="mb-2">
        <label className="form-label fw-bold">Mô tả</label>
        <textarea
          className="form-control form-control-sm"
          rows={2}
          placeholder="Nhập mô tả sản phẩm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="text-end">
        <button className="btn btn-primary btn-sm px-4" disabled={submitting}>
          {submitting ? "Đang lưu..." : product ? "Cập nhật" : "Tạo mới"}
        </button>
      </div>
    </form>
  );
};
