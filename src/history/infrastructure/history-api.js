import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js';

const historyEndpointPath = import.meta.env.VITE_HISTORY_ENDPOINT_PATH;

export class HistoryApi extends BaseApi {
  #historyEndpoint;

  constructor() {
    super();
    this.#historyEndpoint = new BaseEndpoint(this, historyEndpointPath);
  }

  createData(resource) {
    return this.#historyEndpoint.create(resource);
  }

  getEvents() {
    return this.#historyEndpoint.getAll();
  }

  updateData(resource) {
    return this.#historyEndpoint.update(resource.id, resource);
  }

  deleteData(id) {
    return this.#historyEndpoint.delete(id);
  }
}
