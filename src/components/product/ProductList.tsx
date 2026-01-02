import { useState, useMemo, useEffect } from "react";
import type { Product } from "@/types/product";
import "@/components/ui/product.css";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (ids: string[] | string) => void;
  onAdd?: () => void;
  pageSize?: number;
}

export const ProductList = ({
  products,
  onEdit,
  onDelete,
  onAdd,
  pageSize = 10,
}: ProductListProps) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const formatTimeDate = (date?: string | number | Date) => {
    if (!date) return "-";
    const d = new Date(date);
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return (
      <div className="date-wrapper">
        <span className="date-time">{h}:{m}</span>
        <span className="date-day">{day}/{month}/{year}</span>
      </div>
    );
  };

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        (p.description?.toLowerCase().includes(keyword) ?? false)
    );
  }, [products, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  useEffect(() => {
    setSelectedIds([]);
    setExpandedIds([]);
  }, [currentPage]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => products.some((p) => p._id === id)));
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [products, totalPages]);

  const isAllSelected = paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.includes(p._id));

  const toggleSelectAll = () => {
    const pageIds = paginatedProducts.map((p) => p._id);
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div className="product-list-container">
      {/* Header & Toolbar */}
      <div className="product-header">
        <h2 className="header-title">Quản lý sản phẩm</h2>
        <div className="product-toolbar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tìm tên, mô tả..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="action-buttons">
            {selectedIds.length > 0 && (
              <button className="btn-delete-bulk" onClick={() => onDelete(selectedIds)}>
                Xóa đã chọn ({selectedIds.length})
              </button>
            )}
            {onAdd && (
              <button className="btn-add-new" onClick={onAdd}>
                <span className="plus-icon">+</span> Thêm sản phẩm
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Select All Bar */}
      <div className="select-all-bar">
        <label className="checkbox-container">
          <input type="checkbox" checked={isAllSelected} onChange={toggleSelectAll} />
          <span className="checkmark"></span>
          <span className="label-text">Chọn tất cả sản phẩm trên trang này</span>
        </label>
      </div>

      {/* Product List */}
      <div className="product-grid">
        {paginatedProducts.map((product) => {
          const isExpanded = expandedIds.includes(product._id);
          const isSelected = selectedIds.includes(product._id);

          return (
            <div key={product._id} className={`product-card ${isSelected ? "selected" : ""}`}>
              <div className="product-card-content">
                {/* Checkbox */}
                <div className="col-check">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(product._id) ? prev.filter((i) => i !== product._id) : [...prev, product._id]
                        )
                      }
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>

                {/* Image */}
                <div className="col-image">
                  <img src={product.image || "/placeholder-img.png"} alt={product.name} />
                </div>

                {/* Info */}
                <div className="col-info">
                  <h6 className="product-name">{product.name}</h6>
                  <p 
                    className={`product-desc ${isExpanded ? "expanded" : "collapsed"}`}
                    onClick={() => toggleExpand(product._id)}
                  >
                    {product.description || "Không có mô tả"}
                  </p>
                </div>

                {/* Price & Stock */}
                <div className="col-stats d-none d-lg-flex">
                  <div className="stat-item">
                    <span className="stat-label">Giá bán</span>
                    <span className="price-tag">{product.price.toLocaleString()} ₫</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tồn kho</span>
                    <span className={`stock-tag ${product.stock < 10 ? 'low-stock' : ''}`}>
                      {product.stock}
                    </span>
                  </div>
                </div>

                {/* Dates */}
                <div className="col-dates d-none d-xl-flex">
                  <div className="date-item">
                    <span className="stat-label">Ngày tạo</span>
                    {formatTimeDate(product.createdAt)}
                    
                  </div>
                 
                </div>

                <div className="col-dates d-none d-xl-flex">
                  <div className="date-item">
                      <span className="stat-label">Ngày cập nhật</span>
                    {formatTimeDate(product.updatedAt)}
                  </div>
                 
                </div>

                 

                {/* Actions */}
                <div className="col-actions">
                  <button className="btn-icon-edit" title="Sửa" onClick={() => onEdit(product)}>
                    ✏️
                  </button>
                  <button className="btn-icon-delete" title="Xóa" onClick={() => onDelete(product._id)}>
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            className="page-nav" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Trước
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-num ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button 
            className="page-nav" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};