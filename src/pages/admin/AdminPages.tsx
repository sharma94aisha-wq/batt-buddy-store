import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  meta_description: string | null;
  is_published: boolean;
}

const AdminPages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [editing, setEditing] = useState<Partial<Page> | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPages = async () => {
    const { data, error } = await supabase.from("pages" as any).select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setPages((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    const payload = {
      title: editing.title,
      slug: editing.slug || editing.title?.toLowerCase().replace(/\s+/g, "-"),
      content: editing.content || null,
      meta_description: editing.meta_description || null,
      is_published: editing.is_published ?? false,
    };

    if (editing.id) {
      const { error } = await supabase.from("pages" as any).update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
      toast.success("Page updated");
    } else {
      const { error } = await supabase.from("pages" as any).insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Page created");
    }
    setDialogOpen(false);
    setEditing(null);
    fetchPages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this page?")) return;
    const { error } = await supabase.from("pages" as any).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); fetchPages(); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Pages</h1>
        <Button variant="electric" onClick={() => { setEditing({ title: "", slug: "", content: "", meta_description: "", is_published: false }); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />Add Page
        </Button>
      </div>

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell>/{p.slug}</TableCell>
                  <TableCell>{p.is_published ? "✅" : "❌"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing({ ...p }); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pages.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No pages yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Page" : "New Page"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
              <div><Label>Meta Description</Label><Input value={editing.meta_description || ""} onChange={(e) => setEditing({ ...editing, meta_description: e.target.value })} /></div>
              <div><Label>Content</Label><Textarea rows={10} value={editing.content || ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.is_published ?? false} onCheckedChange={(v) => setEditing({ ...editing, is_published: v })} />
                <Label>Published</Label>
              </div>
              <Button variant="electric" className="w-full" onClick={handleSave}>Save Page</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPages;
