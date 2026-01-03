import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { useOrderStore } from "@/stores/useOrderStore";
import type { Product } from "@/types/product";

interface OrderFormProps {
  onSuccess?: () => void;
}

const OrderForm = ({ onSuccess }: OrderFormProps) => {
  const { products, fetchProducts } = useProductStore();
  const { createOrder } = useOrderStore();

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [nameOrder, setNameOrder] = useState("");
  const [description, setDescription] = useState("");
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const selectedProduct: Product | undefined = products.find(
    (p) => p._id === productId
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId || Number(quantity) <= 0)
      return alert("Vui lòng chọn sản phẩm và số lượng hợp lệ");

    if (!nameOrder.trim())
      return alert("Vui lòng nhập tên đơn hàng");

    if (
      selectedProduct &&
      Number(quantity) > selectedProduct.stock
    ) {
      return alert(
        `Số lượng vượt quá tồn kho (Hiện có: ${selectedProduct.stock})`
      );
    }

    try {
      setSubmitting(true);
      await createOrder(
        [{ productId, quantity: Number(quantity) }],
        nameOrder,
        description
      );
      onSuccess?.();

      // Reset form
      setProductId("");
      setQuantity("1");
      setNameOrder("");
      setDescription("");
      setSearchText("");
      setShowDropdown(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3 py-2">
  
      <div className="col-12">
        <label className="form-label fw-bold small">
          Tên đơn hàng <span className="text-danger">*</span>
        </label>
        <input
          className="form-control form-control-sm border-2"
          placeholder="Ví dụ: Đơn hàng chị Lan - Quận 1"
          value={nameOrder}
          onChange={(e) => setNameOrder(e.target.value)}
          required
        />
      </div>
      <div className="col-12">
        <label className="form-label fw-bold small">
          Sản phẩm <span className="text-danger">*</span>
        </label>

        <div className="position-relative">
          <input
            className="form-control form-control-sm border-2"
            placeholder="Tìm theo tên sản phẩm..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            required
          />

          {showDropdown && filteredProducts.length > 0 && (
            <div
              className="position-absolute w-100 shadow-lg border rounded-2 bg-white mt-1"
              style={{ maxHeight: 200, overflowY: "auto", zIndex: 1050 }}
            >
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className="px-3 py-2 border-bottom dropdown-item-custom"
                  style={{ cursor: "pointer" }}
                  onMouseDown={() => {
                    setProductId(p._id);
                    setSearchText(p.name);
                    setShowDropdown(false);
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-medium text-dark">{p.name}</span>
                    <span
                      className={`badge ${
                        p.stock > 0
                          ? "bg-light text-success border"
                          : "bg-danger text-white"
                      }`}
                    >
                      Tồn: {p.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold small">Số lượng đặt</label>
        <input
          type="number"
          min="1"
          className="form-control form-control-sm border-2"
          placeholder="0"
          value={quantity}
          onChange={(e) =>
            setQuantity(Math.max(1, Number(e.target.value)).toString())
          }
          required
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold small text-muted">Tạm tính (₫)</label>
        <div className="form-control form-control-sm border-2 bg-light d-flex align-items-center">
            <span className="fw-bold text-danger">
                {selectedProduct 
                    ? (selectedProduct.price * Number(quantity)).toLocaleString("vi-VN") 
                    : "0"
                }
            </span>
        </div>
      </div>

      <div className="col-12">
        <label className="form-label fw-bold small">Ghi chú / Mô tả đơn hàng</label>
        <textarea
          className="form-control form-control-sm border-2"
          rows={3}
          placeholder="Thông tin thêm về giao hàng..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="col-12 text-end pt-3">
        <button
          className="btn btn-primary px-5 py-2 fw-bold shadow-sm"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Đang xử lý...
            </>
          ) : (
            "Xác nhận tạo đơn"
          )}
        </button>
      </div>

    </form>
  );
};

export default OrderForm;