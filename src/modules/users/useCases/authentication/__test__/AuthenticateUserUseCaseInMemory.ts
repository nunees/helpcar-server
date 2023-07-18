import auth from "@config/auth";
import { User } from "@modules/users/entities/User";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/users/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    id: string;
    name: string;
    username: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
export class AuthenticateUserUseCaseInMemory {
  constructor(
    @inject("UsersRepositoryInMemory")
    private usersRepositoryInMemory: IUsersRepository,
    @inject("UsersTokensRepositoryInMemory")
    private usersTokensRepositoryInMemory: IUsersTokensRepository,
    @inject("DayJsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user: User = await this.usersRepositoryInMemory.findByEmail(email);

    if (!user.email) {
      throw new AppError("Email or password incorrect! 1", 401);
    }

    // Verify password
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError("Email or password incorrect! 2", 401);
    }

    // Generate token
    const token = sign({}, auth.secret_token, {
      subject: user.id as string,
      expiresIn: auth.expires_in_token,
    });

    // Generate refresh token
    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: user.id as string,
      expiresIn: auth.expires_in_refresh_token,
    });

    const refresh_token_expires_date = this.dateProvider?.addDays(
      auth.expires_refresh_token_days
    );

    await this.usersTokensRepositoryInMemory?.create({
      user_id: user.id as string,
      refresh_token,
      expires_date: refresh_token_expires_date,
    });

    const tokenReturn: IResponse = {
      user: {
        id: user.id as string,
        name: user.name,
        username: user.username,
      },
      token,
      refresh_token,
    };

    return tokenReturn;
  }
}