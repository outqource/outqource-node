/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosRequestHeaders } from 'axios';
import queryString from 'query-string';

import type {
  ILocation,
  IKakaoAddress,
  IKakaoKeyword,
  KakaoAddressResponse,
  KakaoKeywordResponse,
  IKakaoGeocode,
  KakaoGeocodeResponse,
  IGoogleGeocode,
  GoogleGeocode,
  GoogleGeocodeResponse,
} from './type';

const kakaoApi = axios.create({
  baseURL: 'https://dapi.kakao.com/v2/local',
});

const googleAPI = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api',
});

class Location {
  private kakaoRestKey: string | undefined;
  private googleRestKey: string | undefined;
  private headers: AxiosRequestHeaders | null = null;

  constructor({ kakaoRestKey, googleRestKey }: ILocation) {
    this.kakaoRestKey = kakaoRestKey;
    this.googleRestKey = googleRestKey;
  }

  private setKakaoHeader(kakaoRestKey: string | undefined) {
    if (!this.kakaoRestKey && kakaoRestKey) throw { status: 500, message: 'Kakao Rest Key is not defined' };

    this.headers = {
      Authorization: `KakaoAK ${kakaoRestKey ?? this.kakaoRestKey}`,
    };
  }

  private parseGoogleGeocode(data: GoogleGeocode[]): Array<GoogleGeocodeResponse> {
    const result: Array<GoogleGeocodeResponse> = [];

    data.forEach(row => {
      const tmpResult: GoogleGeocodeResponse = {
        id: '',
        address_name: row.formatted_address || '',
        region_1depth_name: '',
        region_2depth_name: '',
        region_3depth_name: '',
        region_3depth_h_name: '',
      };
      const addressComponents = row.address_components;
      addressComponents.forEach(addressComponent => {
        if (addressComponent.types.includes('administrative_area_level_1')) {
          tmpResult.region_1depth_name = addressComponent.long_name;
        } else if (addressComponent.types.includes('sublocality_area_level_2')) {
          tmpResult.region_2depth_name = addressComponent.long_name;
        } else if (addressComponent.types.includes('sublocality_level_1')) {
          tmpResult.region_3depth_name = addressComponent.long_name;
        } else if (addressComponent.types.includes('sublocality_level_2')) {
          tmpResult.region_3depth_h_name = addressComponent.long_name;
        }
      });

      result.push(tmpResult);
    });

    return result;
  }

  public async getKakaoLocationByAddress({
    address,
    analyze_type = 'similar',
    page = 1,
    limit = 20,
    kakaoRestKey,
  }: IKakaoAddress): Promise<{ data: KakaoAddressResponse[]; count: number } | null> {
    this.setKakaoHeader(kakaoRestKey);

    const query = {
      query: address,
      analyze_type,
      page,
      size: limit,
    };

    const url = `/local/search/address?${queryString.stringify(query)}`;

    const response = await kakaoApi.get(url, { headers: this.headers! });
    if (!response) return null;

    const documents = response.data.documents;
    return {
      data:
        documents.length === 0
          ? []
          : documents.map((item: { road_address: KakaoAddressResponse }) => item.road_address),
      count: response.data.meta,
    };
  }

  public async getKakaoLocationByKeyword({
    keyword,
    latitude,
    longitude,
    radius = 200,
    page = 1,
    limit = 20,
    kakaoRestKey,
  }: IKakaoKeyword): Promise<{ data: Array<KakaoKeywordResponse>; count: number } | null> {
    this.setKakaoHeader(kakaoRestKey);

    const query = {
      query: keyword,
      page,
      size: limit,
      x: longitude,
      y: latitude,
      radius,
    };

    const kakaoUrl = `/local/search/keyword?${queryString.stringify(query)}`;

    const response = await kakaoApi.get(kakaoUrl, { headers: this.headers! });
    if (!response) return null;

    return { data: response.data.documents, count: response.data.meta };
  }

  public async getKakaoLocationByGeocode({
    latitude,
    longitude,
    page = 1,
    limit = 20,
    kakaoRestKey,
  }: IKakaoGeocode): Promise<{ data: KakaoGeocodeResponse; count: number } | null> {
    this.setKakaoHeader(kakaoRestKey);

    const query = { x: longitude, y: latitude, page, size: limit };
    const url = `/geo/coord2address?${queryString.stringify(query)}`;

    const response = await axios.get(url, { headers: this.headers! });

    return { data: response.data.documents, count: response.data.meta };
  }

  public async getGoogleLocationByGeocode({ googleRestKey, latitude, longitude }: IGoogleGeocode) {
    if (!googleRestKey && this.googleRestKey) throw { status: 500, message: 'Google Rest Key is not defined' };

    const query = {
      latlng: `${latitude},${longitude}`,
      key: this.googleRestKey ?? googleRestKey,
      language: 'ko',
    };

    const url = `/geocode/json?${queryString.stringify(query)}`;
    const response = await googleAPI.get(url);

    if (!response) return null;

    return { data: this.parseGoogleGeocode(response.data.results), count: response.data.results.length };
  }
}

export { Location };
