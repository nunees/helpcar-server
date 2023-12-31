import { IUserCreateDTO } from "@modules/users/dtos/IUserCreateDTO";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { compare, hash } from "bcrypt";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdatePasswordUseCase{
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ){}

  async execute(id: string, password: string, old_password: string): Promise<void>{

    const userExists = await this.usersRepository.fetchUserProfile(id);

    if(!userExists) throw new Error("Usuário não encontrado");

    //onst oldPasswordHash = await hash(old_password, 8);

    const passwordMatch = await compare(old_password, userExists.password);

    if(!passwordMatch) throw new Error("Senha antiga incorreta");

    const newPassword = await hash(password, 8);

    await this.usersRepository.updatePassword(id, newPassword);

  }
}