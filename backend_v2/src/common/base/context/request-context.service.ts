import { AsyncLocalStorage } from 'async_hooks';

interface RequestContextData {
  userId: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContextData>();

export class RequestContextService {
  static storage = asyncLocalStorage;

  static run(userId: string, callback: () => any): any {
    return asyncLocalStorage.run({ userId }, callback);
  }

  static getUserId(): string | undefined {
    return asyncLocalStorage.getStore()?.userId;
  }
}
