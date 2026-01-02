import { useEffect, useState } from "react";
import { useProductStore } from "@/stores/useProductStore";
import { ProductForm } from "@/components/product/product-form";
import { ProductList } from "@/components/product/ProductList";
import type { Product } from "@/types/product";
import "@/components/ui/product.css";

const ProductPage = () => {
  const { products, loading, fetchProducts, deleteProduct } = useProductStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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
    if (idsArray.length === 0) return;
    if (confirm(`Xóa ${idsArray.length} sản phẩm đã chọn?`)) {
      await Promise.all(idsArray.map((id) => deleteProduct(id)));
      fetchProducts();
    }
  };

  return (
    <div className="container py-4">
      {/* Modal overlay */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between mb-3">
              <h5 className="m-0 text-primary">
                {editingProduct ? "Sửa sản phẩm" : "Thêm mới sản phẩm"}
              </h5>
              <button className="btn-close" onClick={() => setShowForm(false)}></button>
            </div>
            <ProductForm
              product={editingProduct ?? undefined}
              onSuccess={() => {
                setShowForm(false);
                fetchProducts();
              }}
            />
          </div>
        </div>
      )}

      {loading && products.length === 0 ? (
        <p className="text-center">Đang tải...</p>
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
