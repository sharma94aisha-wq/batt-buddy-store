import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePageSEO(pageKey: string, fallbackTitle: string, fallbackDescription?: string) {
  useEffect(() => {
    const apply = async () => {
      const { data } = await supabase
        .from("page_seo")
        .select("seo_title, seo_description")
        .eq("page_key", pageKey)
        .maybeSingle();

      document.title = data?.seo_title || fallbackTitle;

      const descMeta = document.querySelector('meta[name="description"]');
      const desc = data?.seo_description || fallbackDescription || "";
      if (descMeta) {
        descMeta.setAttribute("content", desc);
      } else if (desc) {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = desc;
        document.head.appendChild(meta);
      }
    };
    apply();
  }, [pageKey, fallbackTitle, fallbackDescription]);
}
