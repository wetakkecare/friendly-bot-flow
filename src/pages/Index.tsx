
import Hero from "@/components/landing/Hero";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  useEffect(() => {
    if (session && !isLoading) {
      navigate("/dashboard");
    }
  }, [session, navigate, isLoading]);

  return (
    <main>
      <Hero />
    </main>
  );
};

export default Index;
