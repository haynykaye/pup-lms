import { DatabaseStorage } from "../repositories/DatabaseStorage";
import { LMSDataRepository } from "../repositories/LMSDataRepository";

export const repo: LMSDataRepository = new DatabaseStorage();