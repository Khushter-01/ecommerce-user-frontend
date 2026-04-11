import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import api from "@/api/axios";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";

const ProductsPage = () => {
  const [params, setParams] = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState(params.get("search") || "");

  const page = Number(params.get("page")) || 1;

  // ✅ FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams(params);

        if (!query.has("page")) query.set("page", "1");
        if (!query.has("limit")) query.set("limit", "12");

        const res = await api.get(`/products?${query.toString()}`);

        setProducts(res.data.products || []);
        setTotalPages(res.data.pages || 1); // ✅ FIXED HERE

      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params]);

  // ✅ SEARCH HANDLER
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const p = new URLSearchParams(params);

    if (searchInput.trim()) {
      p.set("search", searchInput.trim());
    } else {
      p.delete("search");
    }

    p.set("page", "1"); // reset page
    setParams(p);
  };

  // ✅ PAGINATION HANDLER
  const goToPage = (n: number) => {
    const p = new URLSearchParams(params);
    p.set("page", String(n));
    setParams(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">

      {/* TITLE */}
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Products
      </h1>

      {/* SEARCH */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </form>

      {/* MAIN LAYOUT */}
      <div className="flex gap-8">

        {/* SIDEBAR */}
        <FilterSidebar />

        {/* CONTENT */}
        <div className="flex-1">

          {/* PRODUCTS */}
          <ProductGrid products={products} loading={loading} />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">

              {/* PREV */}
              <button
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                className={`px-3 py-1 border rounded-lg ${
                  page === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-accent"
                }`}
              >
                Prev
              </button>

              {/* PAGE NUMBERS */}
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNumber = i + 1;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === pageNumber
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* NEXT */}
              <button
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
                className={`px-3 py-1 border rounded-lg ${
                  page === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-accent"
                }`}
              >
                Next
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;