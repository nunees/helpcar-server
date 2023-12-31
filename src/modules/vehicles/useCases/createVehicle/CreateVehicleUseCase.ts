import { ICreateVehicleDTO } from "@modules/vehicles/dtos/ICreateVehicleDTO";
import { IVehiclesRepository } from "@modules/vehicles/repositories/IVehiclesRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateVehicleUseCase {
  constructor(
    @inject("VehiclesRepository")
    private vehiclesRepository: IVehiclesRepository
  ) {}

  async execute(vehicle: ICreateVehicleDTO): Promise<void> {
    await this.vehiclesRepository.create(vehicle);
  }
}
