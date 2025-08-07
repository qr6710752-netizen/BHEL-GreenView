import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const initiatives = [
    {
    title: "Switch to Renewable Energy Wind Power",
    status: "In Progress",
    department: "Facilities",
  },
  {
    title: "Paper Waste Reduction Initiative",
    status: "Completed",
    department: "Administration",
  },
  {
    title: "Company-Wide Recycling Program",
    status: "In Progress",
    department: "Operations",
  },
  {
    title: "Energy-Efficient Lighting Upgrade",
    status: "Completed",
    department: "Maintenance",
  },
  {
    title: "Water Conservation in Restrooms",
    status: "Proposed",
    department: "Human Resources",
  },
];

export function InitiativesList() {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <CardTitle>Recent Green Initiatives</CardTitle>
        <CardDescription>
          Latest employee-driven suggestions and projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {initiatives.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.department}</p>
              </div>
              <Badge
                variant={
                  item.status === "Completed"
                    ? "default"
                    : item.status === "In Progress"
                    ? "secondary"
                    : "outline"
                }
                className={item.status === "Completed" ? "bg-primary text-primary-foreground" : ""}
              >
                {item.status}
              </Badge>
            </li>
          ))}
        </ul>
        <Button variant="link" className="p-0 h-auto mt-4" asChild>
          <Link href="/initiatives">View all initiatives</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
