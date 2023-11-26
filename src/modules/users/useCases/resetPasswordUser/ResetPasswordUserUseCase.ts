import { hash } from "bcrypt";
import { inject, injectable } from "tsyringe";


import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { IUsersTokensRepository } from "@modules/users/repositories/IUsersTokensRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export class ResetPasswordUserUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("DayJsDateProvider")
    private dateProvider: IDateProvider,
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.usersTokensRepository.findByRefreshToken(
      token
    );

    if (!userToken) {
      throw new AppError("token.invalid");
    }

    if (
      this.dateProvider.compareIfBefore(
        userToken.expires_date,
        this.dateProvider.datenow()
      )
    ) {
      throw new AppError("token.invalid");
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    user.password = await hash(password, 8);

    await this.usersRepository.updatePassword(user.id as string, user.password);

    await this.usersTokensRepository.deleteById(userToken.id as string);
  }
}