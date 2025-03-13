
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FlowNode, FlowEdge, StateNodeData, ActionEdgeData } from '@/types/flow';

interface PropertiesPanelProps {
  selectedElement: FlowNode | FlowEdge;
  onStateUpdate: (id: string, data: Partial<StateNodeData>) => void;
  onActionUpdate: (id: string, data: Partial<ActionEdgeData>) => void;
  onClose: () => void;
}

const PropertiesPanel = ({
  selectedElement,
  onStateUpdate,
  onActionUpdate,
  onClose,
}: PropertiesPanelProps) => {
  const isNode = 'position' in selectedElement;
  const isEdge = 'source' in selectedElement;
  
  const [formData, setFormData] = useState({
    name: isNode ? selectedElement.data.name : isEdge ? selectedElement.data.name : '',
    description: isNode ? selectedElement.data.description : isEdge ? selectedElement.data.description : '',
    type: isEdge ? selectedElement.data.type : 'core',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNode) {
      onStateUpdate(selectedElement.id, {
        name: formData.name,
        description: formData.description,
      });
    } else if (isEdge) {
      onActionUpdate(selectedElement.id, {
        name: formData.name,
        description: formData.description,
        type: formData.type as 'core' | 'custom',
      });
    }
  };
  
  return (
    <Card className="w-[300px] flex flex-col shadow-lg border-purple-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          {isNode ? "Edit State" : "Edit Action"}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter name"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
            />
          </div>
          
          {isEdge && (
            <div className="space-y-1">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="core">Core</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          )}
          
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertiesPanel;
