// Declare modules that don't have TypeScript definitions

declare module 'pdf-parse' {
  interface PDFData {
    numpages: number;
    numrender: number;
    info: {
      PDFFormatVersion: string;
      IsAcroFormPresent: boolean;
      IsXFAPresent: boolean;
      [key: string]: any;
    };
    metadata: any;
    text: string;
  }

  function parse(dataBuffer: Buffer, options?: any): Promise<PDFData>;
  
  export = parse;
}

declare module 'formidable' {
  import { IncomingMessage } from 'http';
  
  namespace formidable {
    interface Options {
      uploadDir?: string;
      keepExtensions?: boolean;
      maxFileSize?: number;
      allowEmptyFiles?: boolean;
      minFileSize?: number;
      multiples?: boolean;
      [key: string]: any;
    }

    interface File {
      filepath: string;
      newFilename: string;
      originalFilename: string;
      mimetype: string;
      size: number;
      [key: string]: any;
    }

    interface Fields {
      [key: string]: string[] | string;
    }

    interface Files {
      [key: string]: File[] | File;
    }

    interface Callback<T> {
      (err: Error | null, result: T): void;
    }

    interface Form {
      parse(req: IncomingMessage, callback: (err: Error | null, fields: Fields, files: Files) => void): void;
      parse(req: IncomingMessage): Promise<{ fields: Fields; files: Files }>;
    }
  }

  function formidable(options?: formidable.Options): formidable.Form;

  export = formidable;
} 