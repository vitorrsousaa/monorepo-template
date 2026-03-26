import type { IService } from "@application/interfaces/service";
import { IUserSettingsRepository } from "@data/protocols/settings/settings-repository";
import { UserSettingsNotFound } from "../../errors/settings-not-found";
import { GetUserSettingsInput, GetUserSettingsOutput } from "./dto";

export interface IGetUserSettingsService
	extends IService<GetUserSettingsInput, GetUserSettingsOutput> {}

export class GetUserSettingsService implements IGetUserSettingsService { 
  constructor(private readonly userSettingsRepository: IUserSettingsRepository) {}
  
  async execute(input: GetUserSettingsInput): Promise<GetUserSettingsOutput> {
    const settings = await this.userSettingsRepository.getByUserId(input.userId);
    if (!settings) {
      throw new UserSettingsNotFound();
    }
    return { settings };
  }
}