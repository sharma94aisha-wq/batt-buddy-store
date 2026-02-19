import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCustomCode() {
  useEffect(() => {
    const inject = async () => {
      const { data } = await supabase
        .from("custom_code" as any)
        .select("location, code, is_active");

      if (!data) return;

      for (const entry of data as any[]) {
        if (!entry.is_active || !entry.code?.trim()) continue;

        if (entry.location === "head") {
          const container = document.createElement("div");
          container.setAttribute("data-custom-code", "head");
          container.innerHTML = entry.code;
          // Move child nodes into head
          while (container.firstChild) {
            const node = container.firstChild;
            document.head.appendChild(node);
          }
        } else if (entry.location === "body_start") {
          const container = document.createElement("div");
          container.setAttribute("data-custom-code", "body_start");
          container.innerHTML = entry.code;
          document.body.insertBefore(container, document.body.firstChild);
        } else if (entry.location === "body_end") {
          const container = document.createElement("div");
          container.setAttribute("data-custom-code", "body_end");
          container.innerHTML = entry.code;
          document.body.appendChild(container);
        }
      }
    };

    inject();

    return () => {
      document.querySelectorAll("[data-custom-code]").forEach((el) => el.remove());
    };
  }, []);
}
