import { SidebarTrigger } from "./ui/sidebar";

type PageHeaderProps = {
  title: string;
};

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
    </div>
  );
}
