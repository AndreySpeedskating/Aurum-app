import AuthApi from './auth/auth';
import AddressApi from './suggest/suggest';
import ContentApi from './content/content';
import ErrorApi from './error/error';

class Api {
  address: AddressApi;
  auth: AuthApi;
  content: ContentApi;
  error: ErrorApi;

  constructor() {
    this.address = new AddressApi();
    this.auth = new AuthApi();
    this.content = new ContentApi();
    this.error = new ErrorApi();
  }
}

export default new Api();
