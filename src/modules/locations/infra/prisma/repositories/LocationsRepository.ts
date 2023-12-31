import { ICreateLocationDTO } from "@modules/locations/dtos/ICreateLocationDTO";
import { ILocationDTO } from "@modules/locations/dtos/ILocationDTO";
import { IUpdateLocationDTO } from "@modules/locations/dtos/IUpdateLocationDTO";
import { Location } from "@modules/locations/entities/Location";
import { ILocationsRepository } from "@modules/locations/repositories/ILocationsRepository";
import { PrismaClient } from "@prisma/client";
import { AppError } from "@errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
export class LocationsRepository implements ILocationsRepository {
  constructor(
    @inject("PrismaClient")
    private prismaClient: PrismaClient
  ) {}

  async findLocationsByUserId(user_id: string): Promise<Location[]> {
    try{
      const locations = await this.prismaClient.businessLocations.findMany({
        where: {
          user_id,
        }
      });

      return locations as Location[];
    }catch(error){
      throw new AppError("Não foi possível buscar os locais do usuário");
    }
  }

  async fetchAvatar(location_id: string, avatar_file: string): Promise<string> {
    const avatar = await this.prismaClient.businessLocations.findFirst({
      where: {
        avatar: avatar_file,
        AND: {
          id: location_id,
        }
      }
    })

    return avatar?.avatar as string;
  }

  async fetchCoverImage(location_id: string, cover_image: string): Promise<string> {
      const cover = await this.prismaClient.businessLocations.findFirst({
      where: {
        id: location_id,
        AND: {
          cover_photo: cover_image,
        }
      }
    });


    return cover?.cover_photo as string;
  }

  async updateAvatar(location_id: string, avatar_file: string): Promise<void> {
    try{
       await this.prismaClient.businessLocations.update({
        where: {
          id: location_id,
        },
        data: {
          avatar: avatar_file,
        }
      })
    }catch(error){
      throw new AppError("Não foi possível atualizar o avatar do local");
    }
  }
  async updateCoverImage(location_id: string, cover_image: string): Promise<void> {

    try {
      await this.prismaClient.businessLocations.update({
        where: {
          id: location_id,
        },
        data: {
          cover_photo: cover_image,
        }
      })
    } catch (error) {
      throw new AppError("Não foi possível atualizar a imagem de capa do local");
    }
  }


  async create({
    user_id,
    cnpj,
    business_name,
    business_phone,
    business_email,
    address_line,
    number,
    city,
    district,
    state,
    zipcode,
    payment_methods,
    business_categories,
    business_description,
    open_hours,
    open_hours_weekend,
    latitude,
    longitude,

  }: ICreateLocationDTO): Promise<ILocationDTO> {
    try{


      const location = await this.prismaClient.businessLocations.create({
        data: {
          users: {
            connect: {
              id: user_id,
            }
          },
          cnpj,
          business_name,
          business_phone,
          business_email,
          address_line,
          number,
          city,
          district,
          state,
          zipcode,
          payment_methods,
          business_categories,
          business_description,
          open_hours,
          open_hours_weekend,
          latitude,
          longitude
          },
      });

      return location;
    }catch(error){

      throw new AppError("Erro ao criar localização");
    }
  }

  async delete(location_id: string): Promise<void> {
    try {
      await this.prismaClient.businessLocations.delete({
        where: {
          id: location_id,
        },
      });
    } catch (error) {
      throw new AppError("Erro ao deletar localização");
    }
  }


  async update(
    {
      business_name,
      business_phone,
      business_email,
      address_line,
      number,
      city,
      district,
      state,
      zipcode,
      payment_methods,
      business_categories,
      business_description,
      cover_photo,
      avatar,
      open_hours,
      open_hours_weekend,
      latitude,
      longitude,
      active,

    }: IUpdateLocationDTO,
    location_id: string
  ): Promise<void> {
    try {
      const location = await this.prismaClient.businessLocations.findUnique({
        where: {
          id: location_id,
        },
      });

      await this.prismaClient.businessLocations.update({
        where: {
          id: location_id,
        },
        data: {
          business_name: business_name  ?? location?.business_name,
          business_phone: business_phone ?? location?.business_phone,
          business_email: business_email ?? location?.business_email,
          address_line: address_line ?? location?.address_line,
          number: number ?? location?.number,
          city: city ?? location?.city,
          district: district ?? location?.district,
          state: state ?? location?.state,
          zipcode: zipcode ?? location?.zipcode,
          payment_methods: payment_methods ?? location?.payment_methods,
          business_categories: business_categories ?? location?.business_categories,
          business_description: business_description ?? location?.business_description,
          cover_photo: cover_photo ?? location?.cover_photo,
          avatar: avatar ?? location?.avatar,
          open_hours: open_hours ?? location?.open_hours,
          open_hours_weekend: open_hours_weekend ?? location?.open_hours_weekend,
          latitude: latitude ?? location?.latitude,
          longitude: longitude ?? location?.longitude,
          active: active ?? location?.active,
        },
      });
    } catch (error) {
      throw new AppError("Erro ao atualizar localização");
    }
  }

  async findById(location_id: string): Promise<ILocationDTO> {
    try {
      const location = await this.prismaClient.businessLocations.findUnique({
        where: {
          id: location_id,
        },
        include: {
          LocationsPhotos: {
            select: {
              id: true,
              photo: true,
            }
          },
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            }
          }
        }
      });

      return location as unknown as ILocationDTO;
    } catch (error) {
      throw new AppError("Erro ao buscar localização");
    }
  }

  async findAll(user_id: string): Promise<ILocationDTO[]> {
    try {
      const locations = await this.prismaClient.businessLocations.findMany({
        where: {
          user_id,
        },
        orderBy: {
          created_at: "asc",
        },
      });



      return locations as ILocationDTO[];
    } catch (error) {
      throw new AppError("Erro ao buscar localizações");
    }
  }

  async addressExists(
    address_line: string,
    number: number
  ): Promise<boolean | null> {
      const location = await this.prismaClient.businessLocations.findFirst({
        where: {
          address_line,
          AND: {
            number,
          }
        }
      });

      if(location) {
        return true
      };

      return false;

  }

  async uploadPhotos(location_id: string, photo_file: string): Promise<void> {

    await this.prismaClient.locationsPhotos.create({
      data: {
        photo: photo_file,
        location: {
          connect: {
            id: location_id,
          }
        }
      }
    });

  }

  async fetchPhotos(location_id: string, photo_file: string): Promise<string> {
    try{
      const photo = await this.prismaClient.locationsPhotos.findFirst({
        where: {
          location_id,
          AND: {
            photo: photo_file,
          }
        }
      });

      if(!photo) throw new AppError("Nenhuma foto encontrada", 404);

      return photo.photo;

    }catch(error){
      throw new AppError("Não foi possível buscar as fotos do local: ");
    }
  }

  async deletePhoto(photo_id: string): Promise<void> {
    try{
      await this.prismaClient.locationsPhotos.delete({
        where: {
          id: photo_id,
        }
      });
    }catch(error){
      throw new AppError("Não foi possível deletar a foto do local: ");
    }
  }

  async findLocationByService(service_id: number): Promise<Location[] | null> {
    try{
      const locations = await this.prismaClient.businessLocations.findMany({
        where: {
          business_categories: {has : service_id},
        },
        include: {
          users: true,
        },
        orderBy: {
          latitude: "desc",
        }
      })

      return locations as Location[];
    }catch(error){
      throw new AppError("Não foi possível buscar o local pelo serviço: ");
    }
  }

}
