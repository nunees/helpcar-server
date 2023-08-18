import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateVehicleUseCase } from "./CreateVehicleUseCase";

export class CreateVechicleController {
  async handle(request: Request, response: Response) {
    const { id } = request.headers;
    const { brand_id, name_id, color, year, plate, engineMiles } = request.body;

    const createVehicleUseCase = container.resolve(CreateVehicleUseCase);

    await createVehicleUseCase.execute({
      user_id: String(id),
      brand_id,
      name_id,
      color,
      year,
      plate,
      engineMiles,
    });

    return response.status(201).send();
  }
}