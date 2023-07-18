import { CreateAddressController } from "@modules/users/useCases/createAddress/CreateAddressController";
import { CreateUserController } from "@modules/users/useCases/createUser/CreateUserController";

import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { FindAllAddressesController } from "@modules/users/useCases/findAllAddresses/FindAllAddressesController";
import { FindAddressController } from "@modules/users/useCases/findAddress/FindAddressController";
import { DeleteAddressController } from "@modules/users/useCases/deleteAddress/DeleteAddressController";
import { UpdateAvatarController } from "@modules/users/useCases/updateAvatar/UpdateAvatarController";
import multer from "multer";
import uploadConfig from "@config/uploadConfig";

const userRoutes = Router();
const uploadAvatar = multer(uploadConfig.upload("./tmp/avatar"));

const createUserController = new CreateUserController();
const createAddressController = new CreateAddressController();
const findAllAddressesController = new FindAllAddressesController();
const findAddress = new FindAddressController();
const deleteAddress = new DeleteAddressController();
const updateAvatarController = new UpdateAvatarController();

userRoutes.post("/new", createUserController.handle);
userRoutes.post(
  "/address/new",
  ensureAuthenticated,
  createAddressController.handle
);

userRoutes.get(
  "/address/all",
  ensureAuthenticated,
  findAllAddressesController.handle
);

userRoutes.get("/address/:id", ensureAuthenticated, findAddress.handle);

userRoutes.get(
  "/address/delete/:id",
  ensureAuthenticated,
  deleteAddress.handle
);

userRoutes.patch(
  "/avatar",
  ensureAuthenticated,
  uploadAvatar.single("avatar"),
  updateAvatarController.handle
);

export { userRoutes };
