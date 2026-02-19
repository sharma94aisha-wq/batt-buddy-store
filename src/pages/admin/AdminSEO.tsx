import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PageSEO {
  id: string;
  page_key: string;
  page_label: string;
  seo_title: string | null;
  seo_description: string | null;
}

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
}

const AdminSEO = () => {
  const [fixedPages, setFixedPages] = useState<PageSEO[]>([]);
  const [cmsPages, setCmsPages] = useState<CMSPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editType, setEditType] = useState<"fixed" | "cms">("fixed");
  const [editingFixed, setEditingFixed] = useState<PageSEO | null>(null);
  const [editingCms, setEditingCms] = useState<CMSPage | null>(null);

  const fetchData = async () => {
    const [seoRes, pagesRes] = await Promise.all([
      supabase.from("page_seo").select("*").order("page_label"),
      supabase.from("pages").select("id, title, slug, meta_description").order("title"),
    ]);
    if (seoRes.data) setFixedPages(seoRes.data as PageSEO[]);
    if (pagesRes.data) setCmsPages(pagesRes.data as CMSPage[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveFixed = async () => {
    if (!editingFixed) return;
    const { error } = await supabase
      .from("page_seo")
      .update({ seo_title: editingFixed.seo_title, seo_description: editingFixed.seo_description })
      .eq("id", editingFixed.id);
    if (error) return toast.error(error.message);
    toast.success("SEO updated");
    setDialogOpen(false);
    fetchData();
  };

  const handleSaveCms = async () => {
    if (!editingCms) return;
    const { error } = await supabase
      .from("pages")
      .update({ meta_description: editingCms.meta_description })
      .eq("id", editingCms.id);
    if (error) return toast.error(error.message);
    toast.success("SEO updated");
    setDialogOpen(false);
    fetchData();
  };

  const openFixedEdit = (p: PageSEO) => {
    setEditType("fixed");
    setEditingFixed({ ...p });
    setDialogOpen(true);
  };

  const openCmsEdit = (p: CMSPage) => {
    setEditType("cms");
    setEditingCms({ ...p });
    setDialogOpen(true);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">SEO Management</h1>

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <Tabs defaultValue="fixed">
          <TabsList>
            <TabsTrigger value="fixed">Site Pages</TabsTrigger>
            <TabsTrigger value="cms">CMS Pages</TabsTrigger>
          </TabsList>

          <TabsContent value="fixed">
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>SEO Title</TableHead>
                    <TableHead>SEO Description</TableHead>
                    <TableHead className="w-16">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fixedPages.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.page_label}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">{p.seo_title || "—"}</TableCell>
                      <TableCell className="max-w-[300px] truncate text-muted-foreground">{p.seo_description || "—"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => openFixedEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="cms">
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Meta Description</TableHead>
                    <TableHead className="w-16">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cmsPages.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>/{p.slug}</TableCell>
                      <TableCell className="max-w-[300px] truncate text-muted-foreground">{p.meta_description || "—"}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => openCmsEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {cmsPages.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No CMS pages yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editType === "fixed" ? `Edit SEO — ${editingFixed?.page_label}` : `Edit SEO — ${editingCms?.title}`}
            </DialogTitle>
          </DialogHeader>
          {editType === "fixed" && editingFixed && (
            <div className="space-y-4">
              <div>
                <Label>SEO Title <span className="text-xs text-muted-foreground">(max 60 chars)</span></Label>
                <Input maxLength={60} value={editingFixed.seo_title || ""} onChange={(e) => setEditingFixed({ ...editingFixed, seo_title: e.target.value })} />
                <p className="text-xs text-muted-foreground mt-1">{(editingFixed.seo_title || "").length}/60</p>
              </div>
              <div>
                <Label>SEO Description <span className="text-xs text-muted-foreground">(max 160 chars)</span></Label>
                <Input maxLength={160} value={editingFixed.seo_description || ""} onChange={(e) => setEditingFixed({ ...editingFixed, seo_description: e.target.value })} />
                <p className="text-xs text-muted-foreground mt-1">{(editingFixed.seo_description || "").length}/160</p>
              </div>
              <Button variant="electric" className="w-full" onClick={handleSaveFixed}>Save</Button>
            </div>
          )}
          {editType === "cms" && editingCms && (
            <div className="space-y-4">
              <div>
                <Label>SEO Title</Label>
                <Input disabled value={editingCms.title} />
                <p className="text-xs text-muted-foreground mt-1">Edit in Pages section</p>
              </div>
              <div>
                <Label>Meta Description <span className="text-xs text-muted-foreground">(max 160 chars)</span></Label>
                <Input maxLength={160} value={editingCms.meta_description || ""} onChange={(e) => setEditingCms({ ...editingCms, meta_description: e.target.value })} />
                <p className="text-xs text-muted-foreground mt-1">{(editingCms.meta_description || "").length}/160</p>
              </div>
              <Button variant="electric" className="w-full" onClick={handleSaveCms}>Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSEO;
