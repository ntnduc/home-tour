import { AsyncLocalStorage } from 'async_hooks';

interface RequestContextData {
  userId: string;
  userObj: any;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContextData>();

export class RequestContextService {
  static storage = asyncLocalStorage;

  static run(userId: string, userObj: string, callback: () => any): any {
    return asyncLocalStorage.run({ userId, userObj }, callback);
  }

  static getUserId(): string | undefined {
    return asyncLocalStorage.getStore()?.userId;
  }

  static getUserObj(): any | undefined {
    return asyncLocalStorage.getStore()?.userObj;
  }
}
