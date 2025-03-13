
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BotEditor = () => {
  const { botId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Bot Editor</h1>
        </div>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-inner flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Bot Editor Coming Soon</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">The bot editor functionality has been removed.</p>
          <p className="text-gray-500 dark:text-gray-500">Please check back later for updates.</p>
        </div>
      </div>
    </div>
  );
};

export default BotEditor;
