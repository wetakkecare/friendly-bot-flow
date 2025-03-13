
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import FlowEditor from "@/components/FlowEditor";
import { Bot } from "@/types/flow";

const BotEditor = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [localBot, setLocalBot] = useState<Bot | null>(null);
  
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
      
      // Ensure chat_flow has states and actions
      if (!data.chat_flow) {
        data.chat_flow = { states: [], actions: [] };
      } else if (typeof data.chat_flow === 'object') {
        if (!data.chat_flow.states) data.chat_flow.states = [];
        if (!data.chat_flow.actions) data.chat_flow.actions = [];
      }
      
      return data as Bot;
    },
    enabled: !!botId && !!session?.user?.id,
  });

  // Set local bot state when data is loaded
  useEffect(() => {
    if (bot) {
      setLocalBot(bot);
    }
  }, [bot]);

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
    mutationFn: async (updatedBot: Bot) => {
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

  const handleBotChange = (updatedBot: Bot) => {
    setLocalBot(updatedBot);
  };

  const handleSave = () => {
    if (!localBot) return;
    updateBotMutation.mutate(localBot);
  };

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

  if (!localBot) {
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
          <h1 className="text-2xl font-bold">{localBot.name}</h1>
          {isEditing && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
              Editing
            </span>
          )}
        </div>
        
        {isEditing && (
          <Button 
            className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
            onClick={handleSave}
            disabled={updateBotMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        )}
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-inner">
        <FlowEditor 
          bot={localBot} 
          onBotChange={handleBotChange} 
          readOnly={!isEditing} 
        />
      </div>
    </div>
  );
};

export default BotEditor;
