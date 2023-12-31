import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

export class UpdateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.headers;
    const {
      name,
      last_name,
      mobile_phone,
      birth_date,
      username,
      isPartner
    } = request.body;


    const updateUserUseCase = container.resolve(UpdateUserUseCase);

    const user = await updateUserUseCase.execute(String(id), {
      name,
      last_name,
      mobile_phone,
      birth_date,
      username,
      isPartner
    });

    return response.status(201).send(user);
  }
}
