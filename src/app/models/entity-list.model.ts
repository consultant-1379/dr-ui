export interface ListInfoData {
  [name: string]: {
    selected?: boolean;
    items: ListInfoItem[];
  };
}

export interface ListInfoItem {
  name?: string;
  label?: string;
  value?: string;
  selected?: boolean,
  route?: string,
}
