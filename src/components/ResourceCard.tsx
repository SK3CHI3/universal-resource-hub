import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  source: string;
  tags: string[];
  link: string;
}

export const ResourceCard = ({ title, description, source, tags, link }: ResourceCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        <p className="text-sm text-gray-500">Source: {source}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Button className="w-full" onClick={() => window.open(link, "_blank")}>
          Access Now
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};