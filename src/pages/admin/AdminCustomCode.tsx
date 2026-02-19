import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Code } from "lucide-react";

interface CustomCode {
  id: string;
  location: string;
  code: string;
  is_active: boolean;
}

const locationLabels: Record<string, { label: string; description: string }> = {
  head: { label: "Head", description: "Code injected inside <head>. Use for meta tags, analytics scripts, custom CSS, etc." },
  body_start: { label: "Body (Start)", description: "Code injected right after <body> opening tag. Use for tag managers, noscript tags, etc." },
  body_end: { label: "Body (End)", description: "Code injected before </body> closing tag. Use for tracking scripts, chat widgets, etc." },
};

const AdminCustomCode = () => {
  const [entries, setEntries] = useState<CustomCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = async () => {
    const { data } = await supabase.from("custom_code" as any).select("*").order("location");
    if (data) setEntries(data as any);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (entry: CustomCode) => {
    setSaving(entry.id);
    const { error } = await supabase
      .from("custom_code" as any)
      .update({ code: entry.code, is_active: entry.is_active } as any)
      .eq("id", entry.id);
    if (error) toast.error(error.message);
    else toast.success(`${locationLabels[entry.location]?.label || entry.location} code saved`);
    setSaving(null);
  };

  const updateEntry = (id: string, updates: Partial<CustomCode>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Custom Code</h1>
      <p className="text-muted-foreground mb-6">Add custom HTML, CSS, or JavaScript code to different parts of your site.</p>

      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="space-y-6">
          {entries.map((entry) => {
            const info = locationLabels[entry.location] || { label: entry.location, description: "" };
            return (
              <div key={entry.id} className="rounded-lg border border-border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-lg font-semibold text-foreground">{info.label}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${entry.id}`} className="text-sm text-muted-foreground">Active</Label>
                    <Switch
                      id={`active-${entry.id}`}
                      checked={entry.is_active}
                      onCheckedChange={(checked) => updateEntry(entry.id, { is_active: checked })}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{info.description}</p>
                <Textarea
                  value={entry.code}
                  onChange={(e) => updateEntry(entry.id, { code: e.target.value })}
                  rows={6}
                  className="font-mono text-sm"
                  placeholder={`<!-- Paste your ${info.label.toLowerCase()} code here -->`}
                />
                <Button
                  variant="electric"
                  onClick={() => handleSave(entry)}
                  disabled={saving === entry.id}
                >
                  {saving === entry.id ? "Saving..." : "Save"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminCustomCode;
