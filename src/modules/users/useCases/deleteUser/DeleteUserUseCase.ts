import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { AppError } from "@errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject("UsersRepository") private usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<void> {
    const userExists = await this.usersRepository.findById(id);

    if (!userExists) {
      throw new AppError("Erro ao deletar usuário");
    }

    await this.usersRepository.delete(id);
  }
}
