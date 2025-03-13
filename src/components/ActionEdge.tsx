
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, Position } from '@xyflow/react';
import { ActionEdgeData } from '@/types/flow';

const ActionEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}: EdgeProps & { data: ActionEdgeData }) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: sourcePosition || Position.Bottom,
    targetX,
    targetY,
    targetPosition: targetPosition || Position.Top,
  });

  const handleEdgeClick = () => {
    data.onEdgeClick(id);
  };

  const isCustomAction = data.type === 'custom';
  const edgeColor = isCustomAction ? 'var(--color-bot-custom)' : 'var(--color-bot-action)';

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ ...style, stroke: edgeColor, strokeWidth: 2 }} 
        onClick={handleEdgeClick}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div 
            className="bg-white px-2 py-1 rounded border shadow-sm text-xs cursor-pointer"
            onClick={handleEdgeClick}
          >
            {data.name}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default ActionEdge;
