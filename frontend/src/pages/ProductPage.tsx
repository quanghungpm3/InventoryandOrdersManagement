import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { ProductForm } from "@/components/product/product-form";
import { ProductList } from "@/components/product/ProductList";
import type { Product } from "@/types/product";
import "@/components/ui/product.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProductPage = () => {
  const { products, loading, fetchProducts, deleteProduct } =
    useProductStore();

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product?: Product) => {
    setEditingProduct(product ?? null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (ids: string[] | string) => {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    if (!idsArray.length) return;

    if (confirm(`Xóa ${idsArray.length} sản phẩm đã chọn?`)) {
      await Promise.all(idsArray.map((id) => deleteProduct(id)));
      fetchProducts();
    }
  };

  return (
    <div className="container">
      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal-content p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold text-primary m-0">
                <i
                  className={`bi ${editingProduct
                    ? "bi-pencil-square"
                    : "bi-plus-circle"
                    } me-2`}
                />
                {editingProduct
                  ? "Cập nhật sản phẩm"
                  : "Thêm sản phẩm mới"}
              </h5>

              <button
                className="btn-close"
                onClick={() => setShowForm(false)}
              />
            </div>

            <ProductForm
              product={editingProduct ?? undefined}
              onSuccess={() => {
                setShowForm(false);
                setEditingProduct(null);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}

      {loading && products.length === 0 ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          />
          <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={() => handleEdit()}
        />
      )}
    </div>
  );
};

export default ProductPage;
