import { useEffect, useState } from "react";
import { useOrderStore } from "@/stores/useOrderStore";
import OrderForm from "@/components/order/order-form";
import OrderList from "@/components/order/OrdertList";
import type { Order } from "@/types/order";
import "@/components/ui/order.css";

const OrderPage = () => {
  const {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
    clearOrder,
  } = useOrderStore();

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchOrders();
    return () => clearOrder();
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const handleCreate = () => {
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = async (
    orderId: string,
    status: Order["status"]
  ) => {
    await updateOrderStatus(orderId, status);
    await fetchOrders();
  };

  const handleDelete = async (ids: string[]) => {
    if (!ids.length) return;
    if (confirm(`Bạn có chắc muốn xóa ${ids.length} đơn hàng?`)) {
      await deleteOrder(ids);
      await fetchOrders();
    }
  };

  return (
    <div className="container py-4">
      {/* =========================
          MODAL CREATE ORDER
      ========================= */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between mb-3">
              <h5 className="m-0 text-primary">Tạo đơn hàng</h5>
              <button
                className="btn-close"
                onClick={() => setShowForm(false)}
              />
            </div>

            <OrderForm
              onSuccess={() => {
                setShowForm(false);
                fetchOrders();
              }}
            />
          </div>
        </div>
      )}

      {/* =========================
          ORDER LIST
      ========================= */}
      {loading && orders.length === 0 ? (
        <p className="text-center">Đang tải đơn hàng...</p>
      ) : (
        <OrderList
          orders={orders}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onAdd={handleCreate} // Gửi handler xuống OrderList
        />
      )}
    </div>
  );
};

export default OrderPage;
