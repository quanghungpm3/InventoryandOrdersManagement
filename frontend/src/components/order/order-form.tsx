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
  const [quantity, setQuantity] = useState(1);
  const [nameOrder, setNameOrder] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const selectedProduct: Product | undefined = products.find(
    (p) => p._id === productId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId || quantity <= 0)
      return alert("Vui lòng chọn sản phẩm và số lượng hợp lệ");

    if (!nameOrder.trim())
      return alert("Vui lòng nhập tên đơn hàng");

    if (selectedProduct && quantity > selectedProduct.stock)
      return alert("Số lượng vượt quá tồn kho");

    try {
      setSubmitting(true);
      await createOrder([{ productId, quantity }], nameOrder, description);
      onSuccess?.();
      // Reset form
      setProductId("");
      setQuantity(1);
      setNameOrder("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      {/* Tên đơn hàng */}
      <label className="fw-bold">Tên đơn hàng</label>
      <input
        className="form-control"
        placeholder="Nhập tên đơn hàng..."
        value={nameOrder}
        onChange={(e) => setNameOrder(e.target.value)}
        required
      />

      {/* Mô tả */}
      <label className="fw-bold">Mô tả</label>
      <textarea
        className="form-control"
        placeholder="Nhập mô tả (tùy chọn)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Chọn sản phẩm */}
      <label className="fw-bold">Chọn sản phẩm</label>
      <select
        className="form-control"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        required
      >
        <option value="">-- Chọn sản phẩm --</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name} (Tồn: {p.stock})
          </option>
        ))}
      </select>

      {/* Số lượng */}
      <label className="fw-bold">Số lượng</label>
      <input
        type="number"
        min={1}
        className="form-control"
        placeholder="Nhập số lượng..."
        value={quantity}
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        required
      />

      {/* Nút tạo đơn */}
      <button className="btn btn-primary" disabled={submitting}>
        {submitting ? "Đang tạo..." : "Tạo đơn hàng"}
      </button>
    </form>
  );
};

export default OrderForm;
