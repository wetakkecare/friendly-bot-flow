
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate("/");
    }
  }, [session, sessionLoading, navigate]);

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">Dashboard</h1>
      </div>

      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">Welcome to your dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The bot functionality has been removed. This is now a placeholder dashboard.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
