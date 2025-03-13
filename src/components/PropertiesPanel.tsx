
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FlowNode, FlowEdge, StateNodeData, ActionEdgeData } from '@/types/flow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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
    name: '',
    description: '',
    type: 'core',
  });

  useEffect(() => {
    if (isNode) {
      setFormData({
        name: selectedElement.data.name || '',
        description: selectedElement.data.description || '',
        type: 'core',
      });
    } else if (isEdge) {
      setFormData({
        name: selectedElement.data.name || '',
        description: selectedElement.data.description || '',
        type: selectedElement.data.type || 'core',
      });
    }
  }, [selectedElement, isNode, isEdge]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as 'core' | 'custom' }));
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
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
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
