declare module 'pdfjs-dist/build/pdf' {
    export * from 'pdfjs-dist/types/src/display/api';
}
declare module 'pdfjs-dist/build/pdf.worker.entry' {
    const workerSrc: string;
    export default workerSrc;
}