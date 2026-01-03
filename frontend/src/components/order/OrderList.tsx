import { useState, useMemo, useEffect } from "react";
import type { Order, OrderStatus } from "@/types/order";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

interface OrderListProps {
  orders: Order[];
  onStatusChange: (id: string, status: OrderStatus) => void;
  onDelete: (ids: string[]) => void;
  onAdd?: () => void;
  pageSize?: number;
}

const OrderList = ({
  orders,
  onStatusChange,
  onDelete,
  onAdd,
  pageSize = 10,
}: OrderListProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds([]);
    setCurrentPage(1);
  }, [search, statusFilter, dateSort]);

  const statusMap: Record<OrderStatus, { label: string; color: string }> = {
    pending: { label: "Chờ xử lý", color: "warning" },
    completed: { label: "Hoàn thành", color: "success" },
    cancelled: { label: "Đã hủy", color: "danger" },
  };

  const filteredOrders = useMemo(() => {
    let rs = orders.filter((o) => {
      const matchSearch =
        o.nameOrder.toLowerCase().includes(search.toLowerCase()) ||
        o.description?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });

    rs.sort((a, b) => {
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return dateSort === "newest" ? db - da : da - db;
    });

    return rs;
  }, [orders, search, statusFilter, dateSort]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const isAllSelected =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((o) => selectedIds.includes(o._id));

  const formatDate = (date?: string | Date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="order-list bg-light border rounded-4 shadow-sm p-3">
      {/* HEADER */}
      <div className="row g-3 align-items-center mb-3">
        <div className="col-12 col-lg-4">
          <h4 className="fw-bold text-primary m-0">🧾 Quản lý Đơn hàng</h4>
        </div>

        <div className="col-12 col-lg-8">
          <div className="d-flex flex-wrap gap-2 justify-content-lg-end">
            <div className="flex-grow-1 flex-md-grow-0" style={{ minWidth: 200 }}>
              <div className="position-relative shadow-sm rounded-pill overflow-hidden">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input
                  className="form-control ps-5 border-0 rounded-pill"
                  style={{ height: 45 }}
                  placeholder="Tìm sản phẩm..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>


            <select
              className="form-select w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(statusMap).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>

            <select
              className="form-select w-auto"
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value as any)}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>

            {onAdd && (
              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={onAdd}
              >
                <i className="bi bi-plus-lg me-1" />
                Thêm
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SELECT BAR */}
      <div className="bg-white p-2 rounded-3 border mb-3 d-flex justify-content-between align-items-center">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isAllSelected}
            onChange={() => {
              const ids = paginatedOrders.map((o) => o._id);
              setSelectedIds(
                isAllSelected
                  ? selectedIds.filter((id) => !ids.includes(id))
                  : [...new Set([...selectedIds, ...ids])]
              );
            }}
          />
          <label className="form-check-label small fw-semibold ms-1">
            Chọn tất cả ({paginatedOrders.length})
          </label>
        </div>

        {selectedIds.length > 0 && (
          <button
            className="btn btn-sm btn-danger rounded-pill"
            onClick={() => onDelete(selectedIds)}
          >
            <i className="bi bi-trash me-1" />
            Xóa ({selectedIds.length})
          </button>
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="table-responsive d-none d-md-block bg-white rounded-3 shadow-sm">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: 40 }}></th>
              <th>Tên đơn</th>
              <th>Mô tả</th>
              <th>Số lượng</th>
              <th>Tổng tiền</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => {
              const st = statusMap[order.status];
              const selected = selectedIds.includes(order._id);
              const totalItems = order.items.reduce(
                (a, i) => a + (i.quantity || 0),
                0
              );

              return (
                <tr key={order._id} className={selected ? "table-active" : ""}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selected}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(order._id)
                            ? prev.filter((i) => i !== order._id)
                            : [...prev, order._id]
                        )
                      }
                    />
                  </td>

                  <td className="fw-bold">{order.nameOrder}</td>

                  <td
                    className="text-muted small text-truncate"
                    style={{ maxWidth: 220 }}
                    title={order.description}
                  >
                    {order.description || "-"}
                  </td>

                  <td>{totalItems}</td>

                  <td className="fw-bold text-danger">
                    {order.totalAmount.toLocaleString()}₫
                  </td>

                  <td className="small">{formatDate(order.createdAt)}</td>

                  <td>
                    <select
                      className={`form-select form-select-sm border-${st.color} text-${st.color}`}
                      value={order.status}
                      onChange={(e) =>
                        onStatusChange(
                          order._id,
                          e.target.value as OrderStatus
                        )
                      }
                    >
                      {Object.entries(statusMap).map(([k, v]) => (
                        <option key={k} value={k}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete([order._id])}
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="d-md-none d-flex flex-column gap-3">
        {paginatedOrders.map((order) => {
          const st = statusMap[order.status];
          const selected = selectedIds.includes(order._id);
          const totalItems = order.items.reduce(
            (a, i) => a + (i.quantity || 0),
            0
          );

          return (
            <div
              key={order._id}
              className={`bg-white p-3 rounded-4 shadow-sm border-start border-4 border-${st.color}`}
            >
              <div className="d-flex justify-content-between mb-2">
                <div>
                  <div className="fw-bold">{order.nameOrder}</div>
                  {order.description && (
                    <div className="small text-muted">
                      {order.description}
                    </div>
                  )}
                  <div className="small text-primary fw-semibold">
                    SL: {totalItems}
                  </div>
                </div>

                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selected}
                  onChange={() =>
                    setSelectedIds((prev) =>
                      prev.includes(order._id)
                        ? prev.filter((i) => i !== order._id)
                        : [...prev, order._id]
                    )
                  }
                />
              </div>

              <div className="fw-bold text-danger mb-2">
                {order.totalAmount.toLocaleString()}₫
              </div>

              <div className="small text-muted mb-2">
                {formatDate(order.createdAt)}
              </div>

              <div className="d-flex gap-2">
                <select
                  className={`form-select form-select-sm border-${st.color}`}
                  value={order.status}
                  onChange={(e) =>
                    onStatusChange(order._id, e.target.value as OrderStatus)
                  }
                >
                  {Object.entries(statusMap).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete([order._id])}
                >
                  <i className="bi bi-trash3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination pagination-sm justify-content-center">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Trước
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 && "active"
                  }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === totalPages && "disabled"
                }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Sau
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default OrderList;
