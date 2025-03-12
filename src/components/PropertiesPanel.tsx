import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Node, Edge } from '@xyflow/react';
import { StateNodeData, ActionEdgeData } from '../types/flow';

interface PropertiesPanelProps {
  selectedElement: Node<StateNodeData> | Edge<ActionEdgeData> | null;
  onStateUpdate: (id: string, data: Partial<StateNodeData>) => void;
  onActionUpdate: (id: string, data: Partial<ActionEdgeData>) => void;
  onClose: () => void;
}

const PropertiesPanel = ({ 
  selectedElement, 
  onStateUpdate, 
  onActionUpdate,
  onClose 
}: PropertiesPanelProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'core' | 'custom'>('core');

  useEffect(() => {
    if (selectedElement) {
      if ('position' in selectedElement) {
        setName(selectedElement.data.name);
        setDescription(selectedElement.data.description);
      } else {
        setName(selectedElement.data.name);
        setDescription(selectedElement.data.description);
        setType(selectedElement.data.type);
      }
    }
  }, [selectedElement]);

  const handleSave = () => {
    if (!selectedElement) return;

    if ('position' in selectedElement) {
      onStateUpdate(selectedElement.id, {
        name,
        description,
      });
    } else if ('source' in selectedElement) {
      onActionUpdate(selectedElement.id, {
        name,
        description,
        type,
      });
    }
  };

  if (!selectedElement) return null;

  const isNode = 'position' in selectedElement;
  const title = isNode ? 'Estado' : 'Acción';

  return (
    <div className="w-80 border-l border-border bg-background h-full overflow-y-auto">
      <Card className="border-0 rounded-none h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pt-4 pb-2">
          <CardTitle className="text-xl font-medium">
            {title}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre del elemento"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción del elemento"
              className="min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {!isNode && (
            <div className="space-y-2">
              <Label>Tipo de acción</Label>
              <RadioGroup 
                value={type} 
                onValueChange={(value) => setType(value as 'core' | 'custom')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="core" id="core" />
                  <Label htmlFor="core" className="cursor-pointer">Core</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <Button className="w-full" onClick={handleSave}>
            Guardar cambios
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesPanel;
