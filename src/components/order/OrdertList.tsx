import { useState, useMemo, useEffect } from "react";
import type { Order, OrderStatus } from "@/types/order";
import "@/components/ui/order.css";

interface OrderListProps {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onDelete?: (ids: string[]) => void;
  onAdd?: () => void;
  pageSize?: number;
}

const OrderList = ({
  orders,
  onStatusChange,
  onDelete,
  onAdd,
  pageSize = 5,
}: OrderListProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* ===================== FORMAT NGÀY GIỜ ===================== */
  const formatTimeDate = (date?: string | number | Date) => {
    if (!date) return "-";
    const d = new Date(date);
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    const s = d.getSeconds().toString().padStart(2, "0");
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${h}:${m}:${s}, ngày ${day}/${month}/${year}`;
  };

  /* ===================== FILTER ===================== */
  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase();
    return orders.filter((o) => {
      const matchSearch =
        o.nameOrder.toLowerCase().includes(keyword) ||
        (o.description?.toLowerCase().includes(keyword) ?? false);
      const matchStatus =
        statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  /* ===================== PAGINATION ===================== */
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  /* ===================== FIX PHÂN TRANG ===================== */
  useEffect(() => {
    setSelectedIds([]);
  }, [currentPage, search, statusFilter]);

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => orders.some((o) => o._id === id))
    );
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [orders, totalPages]);

  /* ===================== SELECT ===================== */
  const isAllSelected =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((o) => selectedIds.includes(o._id));

  const toggleSelectAll = () => {
    const pageIds = paginatedOrders.map((o) => o._id);
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !pageIds.includes(id))
      );
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (!onDelete || selectedIds.length === 0) return;
    if (confirm(`Xóa ${selectedIds.length} đơn hàng đã chọn?`)) {
      onDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="order-list-container">
      {/* ===================== HEADER + TOOLBAR ===================== */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="fw-bold m-0">Đơn hàng của tôi</h2>

        <div className="order-toolbar d-flex gap-2 flex-wrap">
          <div className="search-input">
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="search-icon">🔍</span>
          </div>

          <select
            className="order-status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">⏳ Đang xử lý</option>
            <option value="completed">✅ Hoàn thành</option>
            <option value="cancelled">❌ Đã hủy</option>
          </select>

          {onAdd && (
            <button className="btn btn-primary" onClick={onAdd}>
              + Tạo đơn hàng
            </button>
          )}

          {onDelete && selectedIds.length > 0 && (
            <button
              className="btn btn-danger"
              onClick={handleDeleteSelected}
            >
              🗑 Xóa ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* ===================== SELECT ALL ===================== */}
      {paginatedOrders.length > 0 && (
        <div className="mb-2">
          <label className="form-check-label d-flex align-items-center gap-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={isAllSelected}
              onChange={toggleSelectAll}
            />
            Chọn tất cả trên trang
          </label>
        </div>
      )}

      {/* ===================== LIST ===================== */}
      {orders.length === 0 ? (
        <p className="text-muted">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="row g-3">
          {paginatedOrders.map((order) => (
            <div key={order._id} className="col-md-6">
              <div className="card order-card shadow-sm p-3 h-100">
                {/* Tên đơn hàng + checkbox */}
                <div className="d-flex justify-content-between mb-2">
                  <label className="form-check-label d-flex gap-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedIds.includes(order._id)}
                      onChange={() => toggleSelect(order._id)}
                    />
                    <strong>{order.nameOrder}</strong>
                  </label>

                  <span className={`order-status-badge ${order.status}`}>
                    {order.status === "pending" && "Đang xử lý"}
                    {order.status === "completed" && "Hoàn thành"}
                    {order.status === "cancelled" && "Đã hủy"}
                  </span>
                </div>

                {/* Mô tả đơn hàng */}
                {order.description && (
                  <p className="text-muted small mb-2 text-truncate-2">
                    <strong>Mô tả:</strong> {order.description}
                  </p>
                )}

                {/* Danh sách sản phẩm */}
                <ul className="list-group list-group-flush mb-2">
                  {order.items.map((item) => (
                    <li
                      key={item.productId}
                      className="list-group-item d-flex justify-content-between px-0"
                    >
                      <span>
                        <strong>{item.name}</strong> × {item.quantity}
                      </span>
                      <span className="fw-medium">
                        {item.price.toLocaleString()} ₫
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Tổng tiền */}
                <div className="text-end fw-bold text-danger mb-2">
                  Tổng tiền: {order.totalAmount.toLocaleString()} ₫
                </div>

                {/* Cập nhật trạng thái + ngày tạo & ngày cập nhật */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      onStatusChange(order._id, e.target.value as OrderStatus)
                    }
                    className="form-select form-select-sm w-auto"
                  >
                    <option value="pending">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>

                  <div className="small text-muted text-end">
                    <div>Ngày tạo: {formatTimeDate(order.createdAt)}</div>
                    <div>Ngày cập nhật: {formatTimeDate(order.updatedAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== PAGINATION ===================== */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              )
            )}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                ›
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default OrderList;
