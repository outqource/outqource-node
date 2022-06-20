interface IprismaControllerGenerator {
  jsonPath: string;
  writePath: string;
}
export declare const prismaControllerGenerator: ({ jsonPath, writePath }: IprismaControllerGenerator) => Promise<void>;
export {};
