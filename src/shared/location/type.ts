export type KakaoAddressType = 'REGION' | 'ROAD' | 'REGION_ADDR' | 'ROAD_ADDR';

export interface ILocation {
  kakaoRestKey: string | undefined;
  googleRestKey: string | undefined;
}

export interface Pagination {
  page?: number;
  limit?: number;
}

export interface Geocode {
  latitude: string;
  longitude: string;
}

export interface GoogleGeocode {
  lat: number;
  lng: number;
}

export interface KakaoGeocode {
  x: string;
  y: string;
}

export interface DistanceProps {
  target: Geocode;
  current: Geocode;
}

interface Address {
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_3depth_h_name: string;
}

interface IKakao {
  kakaoRestKey: string | undefined;
}
interface IGoogle {
  googleRestKey: string | undefined;
}

interface KakaoAddress extends Address {
  h_code: string;
  b_code: string;
  moutain_yn: 'Y' | 'N';
  main_address_no: string;
  sub_address_no: string;
  x: string;
  y: string;
}

type KakaoRoadAddress = Pick<
  KakaoAddress,
  'address_name' | 'region_1depth_name' | 'region_2depth_name' | 'region_3depth_name'
> & {
  road_name: string;
  underground_yn: 'Y' | 'N';
  main_building_no: string;
  sub_building_no: string;
  building_name: string;
  zone_no: string;
};

export interface KakaoAddressResponse extends KakaoGeocode {
  address_name: string;
  address_type: KakaoAddressType;
  address: KakaoAddress;
}

export interface IKakaoAddress extends Pagination, IKakao {
  address: string;
  analyze_type?: 'similar' | 'exact';
}

export interface IKakaoKeyword extends Pagination, Geocode, IKakao {
  keyword: string;
  radius?: number;
}
export interface IKakaoGeocode extends Pagination, Geocode, IKakao {}

export interface KakaoKeywordResponse extends KakaoGeocode {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  category_group_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  place_url: string;
  distance?: string;
}

export interface KakaoGeocodeResponse {
  address: KakaoAddress;
  road_address: KakaoRoadAddress;
}
export interface GoogleAddressComponents {
  long_name: string;
  short_name: string;
  types: Array<string>;
}

export interface GoogleGeometry {
  logcation: GoogleGeocode;
  location_type: string;
  viewport: {
    northeast: GoogleGeocode;
    southwest: GoogleGeocode;
  };
  place_id: string;
  pluse_code: {
    compound_code: string;
    global_code: string;
  };
  types: Array<string>;
}

export interface IGoogleGeocode extends IGoogle, Geocode {}

export interface GoogleGeocode {
  address_components: Array<GoogleAddressComponents>;
  formatted_address: string;
  geometry: any;
}

export interface GoogleGeocodeResponse extends Address {
  id: string;
}
