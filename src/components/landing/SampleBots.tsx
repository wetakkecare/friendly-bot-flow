
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

export default function SampleBots() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: samples = [] } = useQuery({
    queryKey: ["sample-bots"],
    queryFn: async () => {
      const { data } = await supabase.from("sample_bots").select("*");
      return data || [];
    }
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container || samples.length === 0) return;
    
    let animationId: number;
    let position = 0;
    
    const animate = () => {
      position -= 0.5; // Increased speed from 0.2 to 0.5
      
      // Reset position when the first card is fully out of view
      const cardWidth = container.querySelector('div')?.offsetWidth || 300;
      if (Math.abs(position) >= cardWidth + 16) { // 16 for the gap
        position = 0;
        // Move the first element to the end
        if (container.firstElementChild) {
          container.appendChild(container.firstElementChild);
        }
      }
      
      // Apply the transform
      container.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [samples]);

  return (
    <section id="samples" className="py-8 bg-white dark:bg-blue-950">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-900 dark:text-blue-100">
          What You Can Build
        </h2>
        <div className="overflow-hidden">
          <div 
            ref={containerRef}
            className="flex gap-6 pb-4" 
            style={{ willChange: 'transform' }}
          >
            {samples.map((bot: any) => (
              <Card key={bot.id} className="flex-shrink-0 w-[300px] hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">
                    {bot.name}
                  </CardTitle>
                  <CardDescription>{bot.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {bot.feature_list && bot.feature_list.map((feature: string) => (
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
      </div>
    </section>
  );
}
