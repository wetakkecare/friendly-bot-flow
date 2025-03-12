
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

const BotEditor = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  
  // Check if we're in edit mode based on URL
  useEffect(() => {
    const path = window.location.pathname;
    setIsEditing(path.includes('/edit'));
  }, []);

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: bot, isLoading: botLoading } = useQuery({
    queryKey: ["bot", botId],
    queryFn: async () => {
      if (!botId) return null;
      
      const { data, error } = await supabase
        .from("bots")
        .select("*")
        .eq("id", botId)
        .single();
      
      if (error) {
        toast({
          title: "Error",
          description: `Failed to load bot: ${error.message}`,
          variant: "destructive",
        });
        return null;
      }
      
      return data;
    },
    enabled: !!botId && !!session?.user?.id,
  });

  // Redirect to dashboard if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate("/");
    }
  }, [session, sessionLoading, navigate]);

  // Redirect if bot not found or doesn't belong to user
  useEffect(() => {
    if (!botLoading && bot === null) {
      navigate("/dashboard");
    } else if (!botLoading && bot && session?.user?.id !== bot.user_id) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this bot",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [bot, botLoading, session, navigate, toast]);

  const updateBotMutation = useMutation({
    mutationFn: async (updatedBot: any) => {
      const { data, error } = await supabase
        .from("bots")
        .update(updatedBot)
        .eq("id", botId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bot updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["bot", botId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update bot: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (sessionLoading || botLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!bot) {
    return null; // We'll be redirected by the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">{bot.name}</h1>
          {isEditing && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
              Editing
            </span>
          )}
        </div>
        
        {isEditing && (
          <Button 
            className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
            onClick={() => toast({
              title: "Save functionality",
              description: "The save functionality will be implemented in the next steps",
            })}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-inner min-h-[500px]">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg">
            {isEditing 
              ? "The visual flow editor will be implemented here" 
              : "The bot visualization will be displayed here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BotEditor;
