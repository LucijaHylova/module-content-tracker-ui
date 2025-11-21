export interface ModuleComparisonGraphNode {
  id: string;
  name: string;
  symbolSize?: number;
  category: string;

}

export interface ModuleComparisonGraphEdge {
  source: string;
  target: string;
}
