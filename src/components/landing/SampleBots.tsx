
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SampleBots() {
  const { data: samples = [] } = useQuery({
    queryKey: ["sample-bots"],
    queryFn: async () => {
      const { data } = await supabase.from("sample_bots").select("*");
      return data || [];
    }
  });

  return (
    <section id="samples" className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-900 dark:text-blue-100">
          What You Can Build
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {samples.map((bot: any) => (
            <Card key={bot.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <CardTitle className="group-hover:text-blue-600 transition-colors">
                  {bot.name}
                </CardTitle>
                <CardDescription>{bot.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {bot.feature_list.map((feature: string) => (
                    <li key={feature} className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
