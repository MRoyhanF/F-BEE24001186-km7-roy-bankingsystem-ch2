import Joi from "joi";
import { UserService } from "../services/userService.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";

class UserController {
  constructor() {
    this.userService = new UserService();

    this.createUserSchema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      validPassword: Joi.string().valid(Joi.ref("password")).required(),
      profile: Joi.object({
        identity_type: Joi.string().required(),
        identity_number: Joi.number().integer().required(),
      }).required(),
    });

    this.updateUserSchema = Joi.object({
      name: Joi.string().min(3).optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).optional(),
      validPassword: Joi.string().valid(Joi.ref("password")).optional(),
      profile: Joi.object({
        identity_type: Joi.string().optional(),
        identity_number: Joi.number().integer().optional(),
      }).optional(),
    });
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({ Status: "Success", Data: users });
    } catch (error) {
      next(new ErrorHandler(500, error.message));
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) throw new ErrorHandler(404, "User not found");
      res.status(200).json({ Status: "Success", Data: user });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      await this.createUserSchema.validateAsync(req.body);

      const { name, email, password, profile } = req.body;

      const newUser = await this.userService.createUser({
        name,
        email,
        password,
        profile, // Sertakan data profil
      });

      res.status(201).json({ Status: "Success", Data: newUser });
    } catch (error) {
      if (error.isJoi) {
        return next(new ErrorHandler(400, error.details[0].message));
      }
      next(new ErrorHandler(500, error.message));
    }
  }

  async updateUser(req, res, next) {
    try {
      const { name, email, password, validPassword, profile } = req.body;
      const userId = req.params.id;

      // Ambil pengguna dan profil terkait
      const user = await this.userService.getUserById(userId);
      console.log(user);
      if (!user) throw new ErrorHandler(404, "User not found");

      // Validasi password
      if (password || validPassword) {
        if (password && password !== validPassword) {
          throw new ErrorHandler(400, "Password and validPassword do not match");
        }
      }

      // Siapkan data untuk pembaruan pengguna
      const updateData = {
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { password }),
      };

      // Jika ada data profil yang ingin diperbarui
      if (profile) {
        // Ambil ID profil dari pengguna
        const profileId = user.profile[0]?.id; // Mengambil ID dari profil pertama
        console.log(profileId);
        if (!profileId) throw new ErrorHandler(404, "Profile not found");

        // Memperbarui profil menggunakan ID
        await this.userService.updateProfile(profileId, {
          ...(profile.identity_type && { identity_type: profile.identity_type }),
          ...(profile.identity_number && { identity_number: profile.identity_number }),
        });
      }

      const updatedUser = await this.userService.updateUser(userId, updateData);
      res.status(200).json({ Status: "Success", Data: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const deletedUser = await this.userService.deleteUser(req.params.id);
      if (!deletedUser) throw new ErrorHandler(404, "User not found");
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
