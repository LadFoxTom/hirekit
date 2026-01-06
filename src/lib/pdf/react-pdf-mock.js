// Mock module for @react-pdf/renderer on server-side
// This prevents SSR errors when the module is accidentally imported on the server

export const pdf = () => ({
  toBlob: async () => new Blob(),
  toBuffer: async () => Buffer.from(''),
  toString: async () => '',
});

export const Document = () => null;
export const Page = () => null;
export const View = () => null;
export const Text = () => null;
export const Link = () => null;
export const Image = () => null;
export const Canvas = () => null;
export const Note = () => null;
export const PDFViewer = () => null;
export const PDFDownloadLink = () => null;
export const BlobProvider = () => null;
export const usePDF = () => [{ loading: false, blob: null, url: null, error: null }, () => {}];
export const Font = {
  register: () => {},
  registerHyphenationCallback: () => {},
  registerEmojiSource: () => {},
  getFont: () => null,
  load: async () => {},
  clear: () => {},
  reset: () => {},
};
export const StyleSheet = {
  create: (styles) => styles,
  resolve: (style) => style,
  flatten: (...styles) => Object.assign({}, ...styles),
  absoluteFillObject: {},
  hairlineWidth: 1,
};
export const version = '0.0.0-mock';

const reactPdfMock = {
  pdf,
  Document,
  Page,
  View,
  Text,
  Link,
  Image,
  Canvas,
  Note,
  PDFViewer,
  PDFDownloadLink,
  BlobProvider,
  usePDF,
  Font,
  StyleSheet,
  version,
};

export default reactPdfMock;

