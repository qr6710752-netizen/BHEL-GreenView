import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const initiatives = [
  {
    title: "Install LED Lighting",
    status: "In Progress",
    department: "Maintenance",
  },
  {
    title: "Paper Waste Reduction",
    status: "Completed",
    department: "Administration",
  },
  {
    title: "Rainwater Harvesting",
    status: "Proposed",
    department: "Facilities",
  },
   {
    title: "Optimize HVAC System",
    status: "In Progress",
    department: "Engineering",
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
        <Button variant="link" className="p-0 h-auto mt-4">View all initiatives</Button>
      </CardContent>
    </Card>
  );
}
