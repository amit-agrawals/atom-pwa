const platformMethods: typeof window.AtomNative = {
  getDebugMode: () => import.meta.env.DEV,
  isHybrid: () => false,
  getSystemLanguage: () => window.navigator.language,
};

const AtomNative = (window.AtomNative = window.AtomNative || platformMethods);

class NativeBridge {
  public isHybrid() {
    return this.exec("isHybrid");
  }

  public getDebugMode() {
    return this.exec("getDebugMode");
  }

  public getSystemLanguage() {
    return this.exec("getSystemLanguage");
  }

  private exec<T extends keyof typeof AtomNative>(
    methodName: T
    // @ts-ignore fix this
  ): ReturnType<typeof AtomNative[T]> {
    return (AtomNative[methodName]
      ? AtomNative[methodName]?.()
      : platformMethods[methodName]?.()) as any;
  }
}

export default new NativeBridge();
