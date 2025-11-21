export interface GraphNode {
  id: string;
  name: string;
  symbolSize?: number;
  category: string;
  itemStyle : ItemStyle;
}

export interface GraphEdge {
  source: string;
  target: string;
}


class ItemStyle {
  color?: string;
}
