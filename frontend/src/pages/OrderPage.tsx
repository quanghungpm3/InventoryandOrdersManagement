import { useEffect, useState } from "react";
import { useOrderStore } from "@/stores/useOrderStore";
import OrderForm from "@/components/order/order-form";
import OrderList from "@/components/order/OrderList";
import type { Order } from "@/types/order";
import "@/components/ui/product.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const OrderPage = () => {
  const {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
    deleteOrder,
    clearOrder,
  } = useOrderStore();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
    return () => clearOrder();
  }, []);


  const handleCreate = () => {
    setShowModal(true);
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
    <div className="container">

      {loading && orders.length === 0 ? (
        <p className="text-center">Đang tải đơn hàng...</p>
      ) : (
        <OrderList
          orders={orders}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onAdd={handleCreate}
        />
      )}

      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header ">
                  <h5 className="modal-title text-primary">
                    <span className="bi bi-plus-circle fw-bold"> Tạo đơn hàng</span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <OrderForm
                    onSuccess={() => {
                      setShowModal(false);
                      fetchOrders();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderPage;
