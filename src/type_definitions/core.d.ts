interface Window {
  Polymer: any
}

interface HTMLLinkElement {
  async: string
}

interface Element {
  children: HTMLCollection
}

interface Array<T> {
  find(callbackfn: (element: T, index: number, array: T[]) => boolean, thisArg?: any): T;
}
