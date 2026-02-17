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
import { Plus, Pencil, Trash2, Upload, ImageIcon, Star, X } from "lucide-react";
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

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
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
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [newImages, setNewImages] = useState<{ url: string; is_primary: boolean }[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

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

  const fetchProductImages = async (productId: string) => {
    const { data, error } = await supabase
      .from("product_images" as any)
      .select("*")
      .eq("product_id", productId)
      .order("sort_order");
    if (!error && data) setProductImages(data as any);
    else setProductImages([]);
  };

  const handleMultiImageUpload = async (files: FileList) => {
    setUploading(true);
    const uploaded: { url: string; is_primary: boolean }[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(fileName, file);
      if (error) {
        toast.error(`Upload failed for ${file.name}: ${error.message}`);
        continue;
      }
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
      const hasPrimary = productImages.some(i => !deletedImageIds.includes(i.id) && i.is_primary) ||
                          newImages.some(i => i.is_primary) ||
                          uploaded.some(i => i.is_primary);
      uploaded.push({ url: urlData.publicUrl, is_primary: !hasPrimary && uploaded.length === 0 && productImages.filter(i => !deletedImageIds.includes(i.id)).length === 0 && newImages.length === 0 });
    }
    setNewImages(prev => [...prev, ...uploaded]);
    toast.success(`${uploaded.length} image(s) uploaded`);
    setUploading(false);
  };

  const handleSetPrimary = (type: "existing" | "new", index: number) => {
    // Unset all existing
    setProductImages(prev => prev.map(img => ({ ...img, is_primary: false })));
    setNewImages(prev => prev.map(img => ({ ...img, is_primary: false })));
    if (type === "existing") {
      setProductImages(prev => prev.map((img, i) => i === index ? { ...img, is_primary: true } : img));
    } else {
      setNewImages(prev => prev.map((img, i) => i === index ? { ...img, is_primary: true } : img));
    }
  };

  const handleRemoveExistingImage = (id: string) => {
    setDeletedImageIds(prev => [...prev, id]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const getAllImages = () => {
    const existing = productImages.filter(img => !deletedImageIds.includes(img.id));
    return { existing, new: newImages };
  };

  const handleSave = async () => {
    if (!editing?.name) return toast.error("Name is required");

    const allImgs = getAllImages();
    // Determine primary image URL for the main product image_url field
    const primaryExisting = allImgs.existing.find(i => i.is_primary);
    const primaryNew = allImgs.new.find(i => i.is_primary);
    const primaryUrl = primaryExisting?.image_url || primaryNew?.url ||
                       allImgs.existing[0]?.image_url || allImgs.new[0]?.url ||
                       editing.image_url || null;

    const payload = {
      name: editing.name,
      slug: editing.slug || editing.name.toLowerCase().replace(/\s+/g, "-"),
      description: editing.description || null,
      price: editing.price || 0,
      original_price: editing.original_price || null,
      image_url: primaryUrl,
      badge: editing.badge || null,
      rating: editing.rating || 0,
      reviews_count: editing.reviews_count || 0,
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order || 0,
      stock_quantity: editing.stock_quantity ?? 0,
      category_id: editing.category_id || null,
    };

    let productId = editing.id;

    if (editing.id) {
      const { error } = await supabase.from("products" as any).update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { data, error } = await supabase.from("products" as any).insert(payload).select("id").single();
      if (error) return toast.error(error.message);
      productId = (data as any).id;
    }

    // Delete removed images
    if (deletedImageIds.length > 0) {
      await supabase.from("product_images" as any).delete().in("id", deletedImageIds);
    }

    // Update is_primary for existing images
    for (const img of allImgs.existing) {
      await supabase.from("product_images" as any).update({ is_primary: img.is_primary }).eq("id", img.id);
    }

    // Insert new images
    if (newImages.length > 0 && productId) {
      const maxSort = Math.max(0, ...allImgs.existing.map(i => i.sort_order));
      const inserts = newImages.map((img, i) => ({
        product_id: productId,
        image_url: img.url,
        is_primary: img.is_primary,
        sort_order: maxSort + i + 1,
      }));
      await supabase.from("product_images" as any).insert(inserts);
    }

    toast.success(editing.id ? "Product updated" : "Product created");
    setDialogOpen(false);
    setEditing(null);
    setProductImages([]);
    setNewImages([]);
    setDeletedImageIds([]);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products" as any).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Product deleted"); fetchData(); }
  };

  const openNew = () => {
    setEditing({ ...emptyProduct });
    setProductImages([]);
    setNewImages([]);
    setDeletedImageIds([]);
    setDialogOpen(true);
  };

  const openEdit = async (p: Product) => {
    setEditing({ ...p });
    setNewImages([]);
    setDeletedImageIds([]);
    await fetchProductImages(p.id);
    setDialogOpen(true);
  };

  const getCategoryName = (id: string | null) => {
    if (!id) return "—";
    return categories.find((c) => c.id === id)?.name || "—";
  };

  const allImages = getAllImages();

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

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Images</h3>
                <p className="text-xs text-muted-foreground">Click the star to set the main photo. The main photo will be used as the product thumbnail.</p>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {/* Existing images */}
                  {allImages.existing.map((img, i) => (
                    <div key={img.id} className={`relative group rounded-lg border-2 overflow-hidden aspect-square ${img.is_primary ? "border-primary" : "border-border"}`}>
                      <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                      {img.is_primary && (
                        <div className="absolute top-1 left-1 rounded bg-primary px-1.5 py-0.5">
                          <span className="text-[10px] font-bold text-primary-foreground">MAIN</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetPrimary("existing", productImages.findIndex(p => p.id === img.id))}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/90 text-primary-foreground hover:bg-primary"
                          title="Set as main"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(img.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground hover:bg-destructive"
                          title="Remove"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* New images */}
                  {newImages.map((img, i) => (
                    <div key={`new-${i}`} className={`relative group rounded-lg border-2 overflow-hidden aspect-square ${img.is_primary ? "border-primary" : "border-border"}`}>
                      <img src={img.url} alt="" className="h-full w-full object-cover" />
                      {img.is_primary && (
                        <div className="absolute top-1 left-1 rounded bg-primary px-1.5 py-0.5">
                          <span className="text-[10px] font-bold text-primary-foreground">MAIN</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetPrimary("new", i)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/90 text-primary-foreground hover:bg-primary"
                          title="Set as main"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(i)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground hover:bg-destructive"
                          title="Remove"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={() => multiFileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 hover:border-primary/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{uploading ? "Uploading..." : "Add Photos"}</span>
                    </div>
                  </button>
                </div>

                <input
                  ref={multiFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleMultiImageUpload(e.target.files);
                      e.target.value = "";
                    }
                  }}
                />
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

              {/* Reviews */}
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
