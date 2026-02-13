import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  product_count: number;
  sort_order: number;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data, error } = await supabase.from("categories" as any).select("*").order("sort_order");
    if (error) toast.error(error.message);
    else setCategories((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    const payload = {
      name: editing.name,
      slug: editing.slug || editing.name?.toLowerCase().replace(/\s+/g, "-"),
      description: editing.description || null,
      icon: editing.icon || "Battery",
      product_count: editing.product_count || 0,
      sort_order: editing.sort_order || 0,
    };

    if (editing.id) {
      const { error } = await supabase.from("categories" as any).update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Category updated");
    } else {
      const { error } = await supabase.from("categories" as any).insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Category created");
    }
    setDialogOpen(false);
    setEditing(null);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories" as any).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); fetch(); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Categories</h1>
        <Button variant="electric" onClick={() => { setEditing({ name: "", slug: "", description: "", icon: "Battery", product_count: 0, sort_order: 0 }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />Add Category
        </Button>
      </div>

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.icon}</TableCell>
                  <TableCell>{c.product_count}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing({ ...c }); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No categories yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Category" : "New Category"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
              <div><Label>Description</Label><Input value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div><Label>Icon (Lucide name)</Label><Input value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></div>
              <div><Label>Product Count</Label><Input type="number" value={editing.product_count || 0} onChange={(e) => setEditing({ ...editing, product_count: parseInt(e.target.value) })} /></div>
              <Button variant="electric" className="w-full" onClick={handleSave}>Save Category</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
