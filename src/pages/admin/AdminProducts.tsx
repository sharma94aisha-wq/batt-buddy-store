import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  badge: string | null;
  rating: number;
  reviews_count: number;
  is_active: boolean;
  sort_order: number;
}

const emptyProduct = {
  name: "", slug: "", description: "", price: 0, original_price: null as number | null,
  image_url: "", badge: "", rating: 0, reviews_count: 0, is_active: true, sort_order: 0,
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products" as any).select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setProducts((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    const payload = {
      name: editing.name,
      slug: editing.slug || editing.name?.toLowerCase().replace(/\s+/g, "-"),
      description: editing.description || null,
      price: editing.price,
      original_price: editing.original_price || null,
      image_url: editing.image_url || null,
      badge: editing.badge || null,
      rating: editing.rating || 0,
      reviews_count: editing.reviews_count || 0,
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order || 0,
    };

    if (editing.id) {
      const { error } = await supabase.from("products" as any).update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Product updated");
    } else {
      const { error } = await supabase.from("products" as any).insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Product created");
    }
    setDialogOpen(false);
    setEditing(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products" as any).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Product deleted"); fetchProducts(); }
  };

  const openNew = () => { setEditing({ ...emptyProduct }); setDialogOpen(true); };
  const openEdit = (p: Product) => { setEditing({ ...p }); setDialogOpen(true); };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
        <Button variant="electric" onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Product</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>€{Number(p.price).toFixed(2)}</TableCell>
                  <TableCell>{p.badge || "—"}</TableCell>
                  <TableCell>{p.is_active ? "✅" : "❌"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No products yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated from name" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price</Label><Input type="number" step="0.01" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) })} /></div>
                <div><Label>Original Price</Label><Input type="number" step="0.01" value={editing.original_price || ""} onChange={(e) => setEditing({ ...editing, original_price: parseFloat(e.target.value) || null })} /></div>
              </div>
              <div><Label>Image URL</Label><Input value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></div>
              <div><Label>Badge</Label><Input value={editing.badge || ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} placeholder="e.g. Best Seller, Sale, New" /></div>
              <div><Label>Description</Label><Input value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Rating</Label><Input type="number" step="0.1" min="0" max="5" value={editing.rating || ""} onChange={(e) => setEditing({ ...editing, rating: parseFloat(e.target.value) })} /></div>
                <div><Label>Reviews</Label><Input type="number" value={editing.reviews_count || ""} onChange={(e) => setEditing({ ...editing, reviews_count: parseInt(e.target.value) })} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                <Label>Active</Label>
              </div>
              <Button variant="electric" className="w-full" onClick={handleSave}>Save Product</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
