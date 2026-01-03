import { useState, useMemo, useEffect } from "react";
import type { Product } from "@/types/product";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (ids: string[] | string) => void;
  onAdd?: () => void;
  pageSize?: number;
}

export const ProductList = ({ products, onEdit, onDelete, onAdd, pageSize = 10 }: ProductListProps) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<"all" | "high" | "low">("all");
  const [dateSort, setDateSort] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    setSelectedIds([]);
    setCurrentPage(1);
  }, [search, stockFilter, dateSort]);

  const filteredProducts = useMemo(() => {
    let result = [...products].filter(
      p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      if (stockFilter === "high" && a.stock !== b.stock) return b.stock - a.stock;
      if (stockFilter === "low" && a.stock !== b.stock) return a.stock - b.stock;
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateSort === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [products, search, stockFilter, dateSort]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const isAllSelected = paginatedProducts.length > 0 && paginatedProducts.every(p => selectedIds.includes(p._id));

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
    <div className="product-list border shadow-sm rounded-4 p-2 p-md-3 bg-light">
      <div className="row g-2 g-md-3 align-items-center mb-4">
        <div className="col-12 col-lg-3 text-center text-lg-start">
          <h4 className="fw-bold m-0 text-primary">📦 Kho Sản Phẩm</h4>
        </div>
        <div className="col-12 col-lg-9">
          <div className="d-flex flex-wrap justify-content-end align-items-center gap-2 gap-md-3">

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
              className="form-select border-0 shadow-sm rounded-3 h-100"
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value as any)}
              style={{ width: 'auto' }}
            >
              <option value="all">Tất cả kho</option>
              <option value="high">Tồn cao ↓</option>
              <option value="low">Tồn thấp ↑</option>
            </select>

            <select
              className="form-select border-0 shadow-sm rounded-3 h-100"
              value={dateSort}
              onChange={e => setDateSort(e.target.value as any)}
              style={{ width: 'auto' }}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>

            {onAdd && (
              <button
                className="btn btn-primary rounded-pill px-4"
                onClick={onAdd}
              >
                <i className="bi bi-plus-lg me-1" /> Thêm mới
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white p-2 rounded-3 shadow-sm border mb-3 d-flex justify-content-between align-items-center mx-1">
        <div className="form-check ms-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={isAllSelected}
            onChange={() => {
              const ids = paginatedProducts.map(p => p._id);
              setSelectedIds(
                isAllSelected
                  ? selectedIds.filter(id => !ids.includes(id))
                  : [...new Set([...selectedIds, ...ids])]
              );
            }}
          />
          <label className="form-check-label small fw-bold text-muted">
            Chọn tất cả ({paginatedProducts.length})
          </label>
        </div>
        {selectedIds.length > 0 && (
          <button
            className="btn btn-sm btn-danger rounded-pill px-3 shadow-sm"
            onClick={() => onDelete(selectedIds)}
          >
            <i className="bi bi-trash me-1" /> Xóa ({selectedIds.length})
          </button>
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="table-responsive d-none d-md-block bg-white rounded-3 shadow-sm border">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ width: 40 }}></th>
              <th style={{ width: 80 }}>Ảnh</th>
              <th>Sản phẩm</th>
              <th>Mô tả</th>
              <th style={{ width: 140 }}>Giá bán</th>
              <th style={{ width: 110 }}>Tồn kho</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
              <th className="text-end"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map(p => {
              const selected = selectedIds.includes(p._id);
              return (
                <tr key={p._id} className={selected ? "table-active" : ""}>
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        setSelectedIds(prev => prev.includes(p._id) ? prev.filter(i => i !== p._id) : [...prev, p._id])
                      }
                    />
                  </td>
                  <td>
                    <div className="rounded border bg-white overflow-hidden shadow-sm" style={{ width: 55, height: 55 }}>
                      <img src={p.image || "/placeholder.png"} className="w-100 h-100" style={{ objectFit: "contain" }} alt={p.name} />
                    </div>
                  </td>
                  <td className="fw-bold text-dark">{p.name}</td>
                  <td className="text-truncate" style={{ maxWidth: 200 }}>{p.description || "-"}</td>
                  <td className="fw-bold text-danger">{p.price.toLocaleString()}₫</td>
                  <td>
                    <span className={`badge ${p.stock < 10 ? 'bg-danger' : 'bg-success'} rounded-pill px-3`}>{p.stock}</span>
                  </td>
                  <td className="small text-muted">{formatDate(p.createdAt)}</td>
                  <td className="small text-muted">{formatDate(p.updatedAt)}</td>
                  <td className="text-end px-3">
                    <button className="btn btn-outline-primary btn-sm px-3 py-2 me-1" onClick={() => onEdit(p)}>
                      <i className="bi bi-pencil-square me-1" /> Sửa
                    </button>
                    <button className="btn btn-outline-danger btn-sm px-3 py-2" onClick={() => onDelete(p._id)}>
                      <i className="bi bi-trash3 me-1" /> Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD */}
      <div className="d-md-none d-flex flex-column gap-3">
        {paginatedProducts.map(p => {
          const selected = selectedIds.includes(p._id);
          return (
            <div key={p._id} className={`bg-white p-3 rounded-4 shadow-sm border-start border-4 ${p.stock < 10 ? 'border-danger' : 'border-success'} ${selected ? "bg-light border" : ""}`}>

              <div className="d-flex gap-3 align-items-start">
                <input
                  className="form-check-input mt-2"
                  type="checkbox"
                  checked={selected}
                  onChange={() => setSelectedIds(prev => prev.includes(p._id) ? prev.filter(i => i !== p._id) : [...prev, p._id])}
                />
                <div className="rounded border bg-white overflow-hidden shadow-sm flex-shrink-0" style={{ width: 70, height: 70 }}>
                  <img src={p.image || "/placeholder.png"} className="w-100 h-100" style={{ objectFit: 'contain' }} alt={p.name} />
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="fw-bold text-dark text-truncate mb-1" style={{ fontSize: '0.9rem' }}>{p.name}</div>
                  <div className="small text-muted text-truncate mb-2" style={{ maxHeight: '2.6em', overflow: 'hidden', fontSize: '0.75rem' }}>{p.description || "Không có mô tả"}</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-danger fs-6" style={{ fontSize: '0.85rem' }}>{p.price.toLocaleString()}₫</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 d-flex justify-content-between flex-wrap" style={{ fontSize: '0.75rem' }}>
                <span className={`badge ${p.stock < 10 ? 'bg-danger' : 'bg-success'} rounded-pill px-2 py-1`}>Tồn kho: {p.stock}</span>
                <span>Ngày tạo: {formatDate(p.createdAt)}</span>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-light border rounded-pill flex-fill py-2" onClick={() => onEdit(p)}>
                  <i className="bi bi-pencil-square me-1" /> Sửa
                </button>
                <button className="btn btn-outline-danger rounded-pill flex-fill py-2" onClick={() => onDelete(p._id)}>
                  <i className="bi bi-trash3 me-1" /> Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <nav className="mt-4 overflow-auto py-2">
          <ul className="pagination pagination-sm justify-content-center mb-0 border-0">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link rounded-start-pill px-3 border-0 shadow-sm" onClick={() => setCurrentPage(p => p - 1)}>
                <i className="bi bi-chevron-left" />
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item mx-1 ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link rounded-3 border-0 shadow-sm" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link rounded-end-pill px-3 border-0 shadow-sm" onClick={() => setCurrentPage(p => p + 1)}>
                <i className="bi bi-chevron-right" />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};
