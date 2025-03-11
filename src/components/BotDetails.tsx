
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from './FlowEditor';

interface BotDetailsProps {
  bot: Bot;
  onBotChange: (bot: Bot) => void;
}

const BotDetails = ({ bot, onBotChange }: BotDetailsProps) => {
  const [description, setDescription] = useState(bot.description || '');
  const [initialPrompt, setInitialPrompt] = useState(bot.initial_prompt || '');
  const [instructions, setInstructions] = useState(bot.instructions || '');
  const [documents, setDocuments] = useState<string[]>(bot.documents || []);
  const [newDocument, setNewDocument] = useState('');

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    onBotChange({ ...bot, description: newDescription });
  };

  const handleInitialPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setInitialPrompt(newPrompt);
    onBotChange({ ...bot, initial_prompt: newPrompt });
  };

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInstructions = e.target.value;
    setInstructions(newInstructions);
    onBotChange({ ...bot, instructions: newInstructions });
  };

  const handleAddDocument = () => {
    if (newDocument.trim()) {
      const updatedDocuments = [...documents, newDocument.trim()];
      setDocuments(updatedDocuments);
      onBotChange({ ...bot, documents: updatedDocuments });
      setNewDocument('');
    }
  };

  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
    onBotChange({ ...bot, documents: updatedDocuments });
  };

  return (
    <div className="w-full h-full border-t">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid grid-cols-4 w-full bg-muted/30">
          <TabsTrigger value="description">Descripción</TabsTrigger>
          <TabsTrigger value="prompt">Prompt Inicial</TabsTrigger>
          <TabsTrigger value="instructions">Instrucciones</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>
        <ScrollArea className="h-[calc(100vh-460px)] w-full">
          <TabsContent value="description" className="p-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descripción del Bot</Label>
              <Textarea
                id="description"
                placeholder="Describe el propósito y funcionamiento de este bot..."
                value={description}
                onChange={handleDescriptionChange}
                className="min-h-[250px]"
              />
            </div>
          </TabsContent>
          <TabsContent value="prompt" className="p-4">
            <div className="space-y-2">
              <Label htmlFor="initial-prompt">Prompt Inicial</Label>
              <Textarea
                id="initial-prompt"
                placeholder="Escribe el prompt inicial para este bot..."
                value={initialPrompt}
                onChange={handleInitialPromptChange}
                className="min-h-[250px] font-mono text-sm"
              />
            </div>
          </TabsContent>
          <TabsContent value="instructions" className="p-4">
            <div className="space-y-2">
              <Label htmlFor="instructions">Instrucciones</Label>
              <Textarea
                id="instructions"
                placeholder="Proporciona instrucciones detalladas sobre cómo debe comportarse este bot..."
                value={instructions}
                onChange={handleInstructionsChange}
                className="min-h-[250px] font-mono text-sm"
              />
            </div>
          </TabsContent>
          <TabsContent value="documents" className="p-4">
            <div className="space-y-4">
              <div className="flex items-end space-x-2">
                <div className="flex-grow space-y-2">
                  <Label htmlFor="new-document">Agregar Documento</Label>
                  <Input
                    id="new-document"
                    placeholder="URL o referencia al documento..."
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddDocument()}
                  />
                </div>
                <button
                  className="px-4 py-2 bg-primary text-white rounded-md"
                  onClick={handleAddDocument}
                >
                  Agregar
                </button>
              </div>
              <div className="space-y-2">
                <Label>Documentos Vinculados</Label>
                {documents.length > 0 ? (
                  <ul className="space-y-2">
                    {documents.map((doc, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                        <span className="truncate">{doc}</span>
                        <button
                          className="text-destructive hover:text-destructive/70"
                          onClick={() => handleRemoveDocument(index)}
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">No hay documentos vinculados</p>
                )}
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default BotDetails;
