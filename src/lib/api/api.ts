import { DMDATA } from '@dmdata/sdk-js';
import { oauth2Service } from './oauth2';

class ApiService {
  private client = new DMDATA();

  constructor() {
    this.client.setAuthorizationContext({
      getAuthorization: async () => {
        const auth = await oauth2Service.getAuthorization();
        return auth ?? '';
      },
      getDPoPProofJWT: (method: string, uri: string, nonce?: string | null) => oauth2Service.getDPoPProofJWT(method, uri, nonce)
    });
  }

  async contractList() {
    const response = await this.client.contract.list();
    return response.data;
  }

  async telegramGet(tid: string) {
    const res = await this.client.telegramBody.get(tid);
    const contentType = res.headers['content-type'];

    if (contentType === 'application/json' && typeof res.data === 'object') {
      return res.data as object;
    }
    if (contentType === 'application/xml' && typeof res.data === 'string') {
      return new DOMParser().parseFromString(res.data, 'application/xml');
    }
    if (res.data === null || res.status !== 200 || typeof res.data !== 'string') {
      return res.status;
    }

    return res.data;
  }

  async socketStart(classifications: any[], appName?: string, formatMode: 'json' | 'raw' = 'json') {
    const response = await this.client.socket.start({
      classifications,
      appName,
      formatMode
    });
    return response;
  }

  async telegramList(params: any) {
    const response = await this.client.telegram.list(params);
    return response.data;
  }

  async gdEarthquakeList(params: any) {
    const response = await this.client.gdEarthquake.list(params);
    return response.data;
  }

  async gdEarthquakeEvent(eventId: string) {
    const response = await this.client.gdEarthquake.event(eventId);
    return response.data;
  }

  async parameterEarthquakeStation() {
    const response = await this.client.parameter.earthquake();
    return response.data;
  }
}

export const apiService = new ApiService();
