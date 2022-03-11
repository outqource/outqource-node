/// <reference types="node" />
export declare class Sharp {
    private maxWidth?;
    private maxHeight?;
    constructor(props?: {
        maxWidth?: number;
        maxHeight?: number;
    });
    resizeImage(buffer: Buffer): Promise<Buffer>;
}
