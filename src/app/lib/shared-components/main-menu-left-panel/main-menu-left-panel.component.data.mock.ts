import { ListInfoData, ListInfoItem } from "src/app/models";

export const selectedItemMock: ListInfoItem = {
  name: 'Feature packs',
  label: 'Feature packs',
  value: 'Featurepacks',
  selected: true
};

export const itemsMock: ListInfoData = {
  Entity: {
    selected: true,
    items: [
      {
        name: 'Feature packs',
        label: 'Feature packs',
        value: 'productOffering',
        selected: true
      }
    ]
  }
};
