interface ICustomMapValue<T> {
  value: T;
  expireAt?: number;
}

export class CustomMap<K, T> {
  private storage = new Map<K, ICustomMapValue<T>>();

  private interval: NodeJS.Timeout;

  constructor() {
    this.interval = setInterval(
      () => {
        for (const [key, value] of this.storage.entries()) {
          if (value.expireAt) {
            const now = Date.now();

            if (now >= value.expireAt) {
              this.storage.delete(key);
            }
          }
        }
      },
      1_000 * 60 * 10,
    );
  }

  set(key: K, value: T) {
    this.storage.set(key, { value });
  }

  get(key: K) {
    const { value } = this.storage.get(key);

    return value;
  }

  del(key: K) {
    this.storage.delete(key);
  }

  expire(key: K, ms: number) {
    const candidate = this.storage.get(key);

    const expireAt = Date.now() + ms;

    this.storage.set(key, { value: candidate.value, expireAt });
  }

  onDestroy() {
    clearInterval(this.interval);
  }
}
