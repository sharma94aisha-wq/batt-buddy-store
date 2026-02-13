import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Grid3X3, FileText, Layout } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, pages: 0, content: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [p, c, pg, sc] = await Promise.all([
        supabase.from("products" as any).select("id", { count: "exact", head: true }),
        supabase.from("categories" as any).select("id", { count: "exact", head: true }),
        supabase.from("pages" as any).select("id", { count: "exact", head: true }),
        supabase.from("site_content" as any).select("id", { count: "exact", head: true }),
      ]);
      setStats({
        products: p.count || 0,
        categories: c.count || 0,
        pages: pg.count || 0,
        content: sc.count || 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Products", count: stats.products, icon: Package, href: "/admin/products" },
    { label: "Categories", count: stats.categories, icon: Grid3X3, href: "/admin/categories" },
    { label: "Pages", count: stats.pages, icon: FileText, href: "/admin/pages" },
    { label: "Content Blocks", count: stats.content, icon: Layout, href: "/admin/content" },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-foreground">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <a key={c.label} href={c.href} className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-glow">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <c.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{c.count}</p>
                <p className="text-sm text-muted-foreground">{c.label}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
