import { SuggestInstanse, handleRequest } from '../../config';
import { IGeoPayload, ISuggestData } from './interface';

class AddressApi {
  async suggestAddress(value: string): Promise<{ suggestions: ISuggestData[] }> {
    return handleRequest(SuggestInstanse.post('suggest/address', { query: value }));
  }

  async getGeoAddress({
    lat,
    lon,
    radius_meters = 50,
  }: IGeoPayload): Promise<{ suggestions: ISuggestData[] }> {
    return handleRequest(SuggestInstanse.post('geolocate/address', { lat, lon, radius_meters }));
  }
}

export default AddressApi;
