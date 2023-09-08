import {Request, Response} from "express";
import { container } from "tsyringe";
import { CreateScheduleUseCase } from "./createScheduleUseCase";

export class CreateScheduleController{
  async handle(request: Request, response: Response): Promise<Response>{
    const {id}  = request.user;
    const {vehicle_id, location_id, service_type, date, time, notes} = request.body;

    const createScheduleUseCase = container.resolve(CreateScheduleUseCase);

    await createScheduleUseCase.execute({
      user_id: id,
      vehicle_id,
      location_id,
      service_type,
      date,
      time,
      notes
    });


    return response.status(201).send();
  }
}