export interface ILoadingPoint {
  id: number;
  name: string;
}

export interface IUnLoadingPoint {
  id: number;
  name: string;
}

export interface IConterpartie {
  id: number;
  name: string;
}

export interface IAutoPark {
  id: number;
  GarageNumber: string;
  name: string;
  StateNumber: string;
  BrandModel: string;
  volume: number;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUsersPermissionsUser {
  id: 2;
  attributes: {
    username: string;
    phone: string;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IPhotoFormat {
  ext: string; //.jpg,
  url: string; // https://strapiadmin.storage.yandexcloud.net/small_1671040232862_d973d335dd.jpg,
  hash: string; // small_1671040232862_d973d335dd,
  mime: string;
  name: string;
  path: null;
  size: number;
  width: number;
  height: number;
}

export interface IPhoto {
  id: number;
  attributes: {
    name: string;
    alternativeText: string;
    caption: null;
    width: number;
    height: number;
    formats: {
      small: IPhotoFormat;
      thumbnail: IPhotoFormat;
    };
    hash: string; // 1671040232862_d973d335dd,
    ext: string;
    mime: string;
    size: number;
    url: string; // https://strapiadmin.storage.yandexcloud.net/1671040232862_d973d335dd.jpg,
    previewUrl: null;
    provider: string;
    provider_metadata: null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ICargo {
  id: number;
  name: string;
}

export interface IConterpartieResponse {
  id: number;
  name: string;
  blocked: boolean;
  cargos: ICargo[];
  loading_points: ILoadingPoint[];
  unloading_points: IUnLoadingPoint[];
}

export interface IApplicationResponse {
  id: number;
  createdAt: string;
  SendDate: string;
  ApplicationDate: string;
  ApplicationNumber: string;
  volume: number;
  weight: number;
  geolink: string;
  approved: boolean;
  updatedAt: string;
  milleage: number;
  alt_loading_point: string;
  alt_unloading_point: string;
  loading_time: string;
  unloading_time: string;
  ApplicationPhoto: string;
  AppVersion: string;
  counterpartie: {
    id: number;
    name: string;
  };
  loading_point: {
    id: number;
    name: string;
  };
  unloading_point: {
    id: number;
    name: string;
  };
  cargo: {
    id: number;
    name: string;
  };
  auto_park: {
    id: number;
    GarageNumber: string;
    StateNumber: string;
  };
}

export interface IFormat {
  ext: string;
  url: string; // https://strapiadmin.storage.yandexcloud.net/small_189d4f49_0b7c_43ef_9606_525de4811884_1f82b658e5.jpeg,
  hash: string;
  mime: string; // image/jpeg,
  name: string;
  path: null;
  size: number;
  width: number;
  height: number;
}
export interface IFileUploadResponse {
  id: number;
  name: string;
  alternativeText: null;
  caption: null;
  width: number;
  height: number;
  formats: {
    small: IFormat;
    medium: IFormat;
    thumbnail: IFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string; // https://strapiadmin.storage.yandexcloud.net/189d4f49_0b7c_43ef_9606_525de4811884_1f82b658e5.jpeg,
  previewUrl: null;
  provider: string; // aws-s3,
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
}

export interface IMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface IYandexTokenResponse {
  id: number;
  attributes: {
    Token: string;
    createdAt: string;
    updatedAt: string;
    locale: 'en';
  };
}
