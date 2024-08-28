import { ListInfoData } from 'src/app/models';

export const inputMock: ListInfoData = {
  "navigation.MENU": {
    "items": [
      {
        "value": "FeaturePacks",
        "label": "navigation.FEATURE_PACKS"
      },
      {
        "value": "Jobs",
        "label": "navigation.JOBS"
      }
    ],
  }
}

export const outputMock: ListInfoData = {
  "navigation.MENU": {
    "items": [
      {
        "value": "FeaturePacks",
        "label": "navigation.FEATURE_PACKS",
        "name": "navigation.FEATURE_PACKS"
      },
      {
        "value": "Jobs",
        "label": "navigation.JOBS",
        "name": "navigation.JOBS"
      }
    ],
  }
};
