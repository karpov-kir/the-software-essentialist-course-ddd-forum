import { Controller } from '../controllers/Controller.mjs';
import { LifeCheckController } from '../controllers/LifeCheckController.mjs';
import { ProfileController } from '../controllers/ProfileController.mjs';
import { SignInController } from '../controllers/SignInController.mjs';
import { SignUpController } from '../controllers/SignUpController.mjs';
import { UpdateUserController } from '../controllers/UpdateUserController.mjs';
import { UsersController } from '../controllers/UsersController.mjs';

export interface Route {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  isProtected: boolean;
  controller: Controller;
}

export interface Controllers {
  lifeCheckController: LifeCheckController;
  signInController: SignInController;
  signUpController: SignUpController;
  profileController: ProfileController;
  updateUserController: UpdateUserController;
  usersController: UsersController;
}

export const createRoutes = ({
  lifeCheckController,
  signInController,
  signUpController,
  profileController,
  updateUserController,
  usersController,
}: Controllers): Route[] => {
  return [
    {
      path: '/',
      method: 'GET',
      isProtected: false,
      controller: lifeCheckController,
    },
    {
      path: '/signIn',
      method: 'POST',
      isProtected: false,
      controller: signInController,
    },
    {
      path: '/signUp',
      method: 'POST',
      isProtected: false,
      controller: signUpController,
    },
    {
      path: '/profile',
      method: 'GET',
      isProtected: true,
      controller: profileController,
    },
    {
      path: '/users/:id',
      method: 'PUT',
      isProtected: true,
      controller: updateUserController,
    },
    {
      path: '/users',
      method: 'GET',
      isProtected: true,
      controller: usersController,
    },
  ];
};
