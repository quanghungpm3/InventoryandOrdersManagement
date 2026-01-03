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

  // Logic mới: Ngăn nhập số âm cho tồn kho
  const handleStockChange = (value: string) => {
    // Chỉ cho phép số, nếu giá trị nhỏ hơn 0 thì đưa về 0
    if (Number(value) < 0) return setStock("0");
    setStock(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return alert("Vui lòng điền đủ thông tin");
    
    // Kiểm tra thêm lần cuối trước khi gửi
    if (Number(stock) < 0) return alert("Số lượng tồn kho không được nhỏ hơn 0");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    if (imageFile) formData.append("image", imageFile);

    try {
      setSubmitting(true);
      product ? await updateProduct(product._id, formData) : await createProduct(formData);
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3 py-2">
      <div className="col-12">
        <label className="form-label fw-bold small">
          Tên sản phẩm <span className="text-danger">*</span>
        </label>
        <input
          className="form-control form-control-sm border-2"
          placeholder="Nhập tên sản phẩm..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold small">Giá bán (₫)</label>
        <input
          className="form-control form-control-sm border-2 text-danger fw-bold"
          placeholder="0"
          value={formattedPrice}
          onChange={(e) => handlePriceChange(e.target.value)}
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold small">Số lượng tồn</label>
        <input
          className="form-control form-control-sm border-2"
          type="number"
          min="0"
          placeholder="0"
          value={stock}
          onChange={(e) => handleStockChange(e.target.value)}
          required
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-bold small">Hình ảnh</label>
        <input
          className="form-control form-control-sm border-2"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-bold small">Mô tả sản phẩm</label>
        <textarea
          className="form-control form-control-sm border-2"
          rows={3}
          placeholder="Mô tả ngắn gọn về sản phẩm..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="col-12 text-end pt-3">
        <button className="btn btn-primary px-5 py-2 fw-bold shadow-sm" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span> Đang xử lý...
            </>
          ) : (
            product ? "Lưu thay đổi" : "Thêm sản phẩm"
          )}
        </button>
      </div>
    </form>
  );
};