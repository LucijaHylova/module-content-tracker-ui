export interface ScatterNode {
  x: number;
  y: number;
  name: string;
  id: string
  ects: number;
  category: string;
  specialization: string;
  status?: string;
  selectedSemester: number;
  itemStyle? : ItemStyle;
}

export interface ItemStyle {
  color?: string;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
}
