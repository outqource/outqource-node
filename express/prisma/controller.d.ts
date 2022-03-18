import type { Request, Response, NextFunction } from "express";
import type { PrismaClient } from "@prisma/client";
import type { ControllerAPI } from "../../shared/openapi";
export declare type PrismaAction = "findUnique" | "findMany" | "findFirst" | "create" | "createMany" | "update" | "updateMany" | "upsert" | "delete" | "deleteMany" | "executeRaw" | "queryRaw" | "aggregate" | "count";
export declare type CreatePrismaControllerOptions = {
    table: string;
    actions: PrismaAction[] | PrismaAction;
    pagination?: boolean;
    response?: boolean;
    softDelete?: string | string[];
    options?: any;
};
export declare const createPrismaController: (database: PrismaClient, controllerAPI: ControllerAPI, options: CreatePrismaControllerOptions) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
