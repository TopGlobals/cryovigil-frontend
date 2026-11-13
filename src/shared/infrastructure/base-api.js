import axios from 'axios';
import { iamInterceptor } from '../../iam/infrastructure/iam.interceptor.js';

const platformApi =
  import.meta.env.VITE_CRYOVIGIL_PLATFORM_API_URL || 'http://localhost:3000';

export class BaseApi {
  #http;

  constructor() {
    this.#http = axios.create({
      baseURL: platformApi,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.#http.interceptors.request.use(iamInterceptor);
  }
  get http() {
    return this.#http;
  }
}
