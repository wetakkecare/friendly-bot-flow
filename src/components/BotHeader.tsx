
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BotHeaderProps {
  botName: string;
  onNameChange: (name: string) => void;
  onNewBot: () => void;
  onSearch: (query: string) => void;
  onSave: () => void;
}

const BotHeader = ({ botName, onNameChange, onNewBot, onSearch, onSave }: BotHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameBlur = () => {
    setIsEditing(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  const handleNewBot = () => {
    onNewBot();
    toast({
      title: "Nuevo bot creado",
      description: "Se ha creado un nuevo bot vacío",
    });
  };

  const handleSaveBot = () => {
    onSave();
    toast({
      title: "Cambios guardados",
      description: "Se han guardado los cambios en el bot",
    });
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        {isEditing ? (
          <Input
            className="text-2xl font-bold"
            value={botName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <h1 
            className="text-2xl font-bold cursor-pointer hover:text-primary" 
            onClick={handleNameClick}
          >
            {botName || 'Bot sin nombre'}
          </h1>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Input
            className="w-64 pl-10"
            placeholder="Buscar estados..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
            onClick={handleSearch}
          />
        </div>
        <Button onClick={handleNewBot} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Bot
        </Button>
        <Button onClick={handleSaveBot} variant="default" size="sm">
          <Save className="mr-2 h-4 w-4" />
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default BotHeader;
