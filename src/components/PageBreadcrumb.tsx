import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem as BreadcrumbListItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbEntry[];
}

const PageBreadcrumb = ({ items }: PageBreadcrumbProps) => (
  <Breadcrumb className="mb-6">
    <BreadcrumbList>
      <BreadcrumbListItem>
        <BreadcrumbLink asChild>
          <Link to="/">Home</Link>
        </BreadcrumbLink>
      </BreadcrumbListItem>
      {items.map((item, i) => (
        <span key={i} className="contents">
          <BreadcrumbSeparator />
          <BreadcrumbListItem>
            {item.href ? (
              <BreadcrumbLink asChild>
                <Link to={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
          </BreadcrumbListItem>
        </span>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
);

export default PageBreadcrumb;
