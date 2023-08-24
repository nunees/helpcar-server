import { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

export class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
   try{
    const { email, password } = request.body;
    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);
    const token = await authenticateUserUseCase?.execute({
      email,
      password,
    });
    return response.json(token);
   }catch(error){
    console.log(error.message);
    return response.status(500).json("Erro ao autenticar usuário")
   }
  }
}
