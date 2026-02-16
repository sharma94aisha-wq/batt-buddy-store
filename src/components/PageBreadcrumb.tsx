import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbEntry[];
  className?: string;
}

const PageBreadcrumb = ({ items, className }: PageBreadcrumbProps) => (
  <nav aria-label="breadcrumb" className={cn("mb-6", className)}>
    <ol className="flex flex-wrap items-center gap-2 text-sm">
      <li>
        <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
          Home
        </Link>
      </li>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2">
          <span className="text-muted-foreground">/</span>
          {item.href ? (
            <Link to={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default PageBreadcrumb;
