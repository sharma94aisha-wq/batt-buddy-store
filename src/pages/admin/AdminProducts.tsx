import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Upload, ImageIcon } from "lucide-react";
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
  stock_quantity: number;
  category_id: string | null;
}

interface Category {
  id: string;
  name: string;
}

const emptyProduct: Partial<Product> = {
  name: "", slug: "", description: "", price: 0, original_price: null,
  image_url: "", badge: "", rating: 0, reviews_count: 0, is_active: true,
  sort_order: 0, stock_quantity: 0, category_id: null,
};

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const [prodRes, catRes] = await Promise.all([
      supabase.from("products" as any).select("*").order("sort_order"),
      supabase.from("categories" as any).select("id, name").order("name"),
    ]);
    if (prodRes.error) toast.error(prodRes.error.message);
    else setProducts((prodRes.data as any) || []);
    if (!catRes.error) setCategories((catRes.data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
    setEditing((prev) => prev ? { ...prev, image_url: urlData.publicUrl } : prev);
    toast.success("Image uploaded");
    setUploading(false);
  };

  const handleSave = async () => {
    if (!editing?.name) return toast.error("Name is required");
    const payload = {
      name: editing.name,
      slug: editing.slug || editing.name.toLowerCase().replace(/\s+/g, "-"),
      description: editing.description || null,
      price: editing.price || 0,
      original_price: editing.original_price || null,
      image_url: editing.image_url || null,
      badge: editing.badge || null,
      rating: editing.rating || 0,
      reviews_count: editing.reviews_count || 0,
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order || 0,
      stock_quantity: editing.stock_quantity ?? 0,
      category_id: editing.category_id || null,
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
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products" as any).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Product deleted"); fetchData(); }
  };

  const openNew = () => { setEditing({ ...emptyProduct }); setDialogOpen(true); };
  const openEdit = (p: Product) => { setEditing({ ...p }); setDialogOpen(true); };

  const getCategoryName = (id: string | null) => {
    if (!id) return "—";
    return categories.find((c) => c.id === id)?.name || "—";
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
        <Button variant="electric" onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Product</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="rounded-lg border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>€{Number(p.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${
                      p.stock_quantity === 0 ? "text-destructive"
                      : p.stock_quantity <= 2 ? "text-red-500"
                      : p.stock_quantity <= 4 ? "text-orange-500"
                      : "text-green-500"
                    }`}>
                      {p.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{getCategoryName(p.category_id)}</TableCell>
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
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No products yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Product" : "New Product"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Info</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Name *</Label><Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
                  <div><Label>Slug</Label><Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="auto-generated from name" /></div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={editing.description || ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={4}
                    placeholder="Product description..."
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Image */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Image</h3>
                <div className="flex items-start gap-4">
                  {editing.image_url ? (
                    <img src={editing.image_url} alt="Preview" className="h-24 w-24 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-dashed border-border bg-muted">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {uploading ? "Uploading..." : "Upload Image"}
                    </Button>
                    <div>
                      <Label className="text-xs text-muted-foreground">Or enter URL</Label>
                      <Input
                        value={editing.image_url || ""}
                        onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                        placeholder="https://..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pricing & Stock</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Price (€) *</Label><Input type="number" step="0.01" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })} /></div>
                  <div><Label>Original Price (€)</Label><Input type="number" step="0.01" value={editing.original_price || ""} onChange={(e) => setEditing({ ...editing, original_price: parseFloat(e.target.value) || null })} /></div>
                  <div><Label>Stock Quantity</Label><Input type="number" min="0" value={editing.stock_quantity ?? 0} onChange={(e) => setEditing({ ...editing, stock_quantity: parseInt(e.target.value) || 0 })} /></div>
                </div>
              </div>

              {/* Category & Badge */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Organization</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={editing.category_id || "none"}
                      onValueChange={(v) => setEditing({ ...editing, category_id: v === "none" ? null : v })}
                    >
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Category</SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Badge</Label><Input value={editing.badge || ""} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} placeholder="e.g. Best Seller, Sale, New" className="mt-1" /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Sort Order</Label><Input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} /></div>
                  <div className="flex items-end gap-3 pb-1">
                    <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                    <Label>Active (visible to customers)</Label>
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reviews</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Rating (0–5)</Label><Input type="number" step="0.1" min="0" max="5" value={editing.rating || ""} onChange={(e) => setEditing({ ...editing, rating: parseFloat(e.target.value) || 0 })} /></div>
                  <div><Label>Reviews Count</Label><Input type="number" value={editing.reviews_count || ""} onChange={(e) => setEditing({ ...editing, reviews_count: parseInt(e.target.value) || 0 })} /></div>
                </div>
              </div>

              <Button variant="electric" className="w-full" onClick={handleSave}>
                {editing.id ? "Update Product" : "Create Product"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
