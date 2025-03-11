
import { useState, useCallback } from 'react';
import BotHeader from '@/components/BotHeader';
import FlowEditor, { Bot } from '@/components/FlowEditor';
import BotDetails from '@/components/BotDetails';

const emptyBot: Bot = {
  id: `bot-${Date.now()}`,
  name: 'Nuevo Bot',
  description: '',
  initial_prompt: '',
  instructions: '',
  chat_flow: {
    states: [],
    actions: []
  },
  documents: []
};

const Index = () => {
  const [currentBot, setCurrentBot] = useState<Bot>(emptyBot);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleBotChange = useCallback((updatedBot: Bot) => {
    setCurrentBot(updatedBot);
    // En una aplicación real, aquí se guardaría en el backend
    console.log('Bot actualizado:', updatedBot);
  }, []);
  
  const handleNewBot = useCallback(() => {
    setCurrentBot({
      ...emptyBot,
      id: `bot-${Date.now()}`
    });
  }, []);
  
  const handleSave = useCallback(() => {
    // En una aplicación real, aquí se enviaría al backend
    console.log('Guardando bot:', currentBot);
    localStorage.setItem(`bot_${currentBot.id}`, JSON.stringify(currentBot));
  }, [currentBot]);
  
  return (
    <div className="flex flex-col h-screen">
      <BotHeader
        botName={currentBot.name}
        onNameChange={(name) => handleBotChange({ ...currentBot, name })}
        onNewBot={handleNewBot}
        onSearch={setSearchQuery}
        onSave={handleSave}
      />
      <div className="flex-grow flex flex-col h-full">
        <div className="flex-grow">
          <FlowEditor 
            bot={currentBot} 
            onBotChange={handleBotChange} 
            filterQuery={searchQuery}
          />
        </div>
        <div className="h-[300px]">
          <BotDetails 
            bot={currentBot} 
            onBotChange={handleBotChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
