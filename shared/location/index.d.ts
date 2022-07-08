import type {
  ILocation,
  IKakaoAddress,
  IKakaoKeyword,
  KakaoAddressResponse,
  KakaoKeywordResponse,
  IKakaoGeocode,
  KakaoGeocodeResponse,
  IGoogleGeocode,
  GoogleGeocodeResponse,
  DistanceProps,
} from './type';
declare class Location {
  private kakaoRestKey;
  private googleRestKey;
  private headers;
  constructor({ kakaoRestKey, googleRestKey }: ILocation);
  private setKakaoHeader;
  private parseGoogleGeocode;
  getKakaoLocationByAddress({ address, analyze_type, page, limit, kakaoRestKey }: IKakaoAddress): Promise<{
    data: KakaoAddressResponse[];
    count: number;
  } | null>;
  getKakaoLocationByKeyword({
    keyword,
    latitude,
    longitude,
    radius,
    page,
    limit,
    kakaoRestKey,
  }: IKakaoKeyword): Promise<{
    data: Array<KakaoKeywordResponse>;
    count: number;
  } | null>;
  getKakaoLocationByGeocode({ latitude, longitude, page, limit, kakaoRestKey }: IKakaoGeocode): Promise<{
    data: KakaoGeocodeResponse;
    count: number;
  } | null>;
  getGoogleLocationByGeocode({ googleRestKey, latitude, longitude }: IGoogleGeocode): Promise<{
    data: GoogleGeocodeResponse[];
    count: any;
  } | null>;
  static getDistance({ target, current }: DistanceProps): number;
}
export { Location };
