import sharp, { ResizeOptions } from 'sharp';

export class Sharp {
  private maxWidth?: number;
  private maxHeight?: number;

  constructor(props?: { maxWidth?: number; maxHeight?: number }) {
    this.maxWidth = props?.maxWidth;
    this.maxHeight = props?.maxHeight;
  }

  async resizeImage(buffer: Buffer): Promise<Buffer> {
    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;

    const options: ResizeOptions = {
      fit: 'contain',
    };

    if (width && height && this.maxWidth && this.maxHeight) {
      if (width > height && width > this.maxWidth) {
        options.width = this.maxWidth;
      } else if (width > height && width <= this.maxWidth) {
        options.width = width;
      }

      if (width < height && height > this.maxHeight) {
        options.height = this.maxHeight;
      } else if (width < height && height <= this.maxHeight) {
        options.height = height;
      }
    }

    const newBuffer = await sharp(buffer)
      .resize(options)
      .withMetadata()
      .toBuffer();

    return newBuffer;
  }
}
