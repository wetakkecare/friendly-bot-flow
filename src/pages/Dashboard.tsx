
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: bots = [], isLoading: botsLoading } = useQuery({
    queryKey: ["user-bots"],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await supabase
        .from("bots")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const createBotMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to create a bot");
      }

      const newBot = {
        name: "New Bot",
        description: "A new bot created by you",
        user_id: session.user.id,
      };

      const { data, error } = await supabase
        .from("bots")
        .insert([newBot])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Bot created",
        description: "Your new bot has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["user-bots"] });
      // Optionally navigate to a bot editing page
      // navigate(`/bot/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create bot: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleCreateBot = () => {
    createBotMutation.mutate();
  };

  const handleEditBot = (botId: string) => {
    // This would navigate to the bot editor page
    // navigate(`/bot/${botId}`);
    toast({
      title: "Edit functionality",
      description: "The edit functionality will be implemented soon",
    });
  };

  const handleOpenBot = (botId: string) => {
    // This would navigate to the bot viewer page
    // navigate(`/bot/${botId}/view`);
    toast({
      title: "Open functionality",
      description: "The open functionality will be implemented soon",
    });
  };

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate("/");
    }
  }, [session, sessionLoading, navigate]);

  const isLoading = sessionLoading || botsLoading || createBotMutation.isPending;

  if (isLoading && !createBotMutation.isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-200">My Bots</h1>
        <Button 
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
          onClick={handleCreateBot}
          disabled={isLoading}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Bot
        </Button>
      </div>

      {bots.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">You don't have any bots yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first bot to get started</p>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
            onClick={handleCreateBot}
            disabled={isLoading}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Bot
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot: any) => (
            <div key={bot.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-medium mb-2">{bot.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{bot.description}</p>
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2" onClick={() => handleEditBot(bot.id)}>Edit</Button>
                <Button onClick={() => handleOpenBot(bot.id)}>Open</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
