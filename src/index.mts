import { Prisma, PrismaClient, User } from '@prisma/client';
import express, { Request, Response } from 'express';

class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(user: Prisma.UserCreateInput): Promise<User> {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      throw new Error('Invalid email address');
    }

    try {
      return await this.prisma.user.create({
        data: user,
      });
    } catch (error) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError;
      const meta = prismaError.meta as { target?: string | string[] };

      if (prismaError.code === 'P2002' && meta?.target?.includes('email')) {
        throw new Error('Email address already exists');
      }

      throw new Error('Internal server error');
    }
  }

  async updateUser(id: number, user: Prisma.UserUpdateInput): Promise<User> {
    // Validate email
    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email as string)) {
      throw new Error('Invalid email address');
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data: user,
      });
    } catch (error) {
      const prismaError = error as Prisma.PrismaClientKnownRequestError;
      const meta = prismaError.meta as { target?: string | string[] };

      if (prismaError.code === 'P2002' && meta?.target?.includes('email')) {
        throw new Error('Email address already exists');
      }

      throw new Error('Internal server error');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}

const userService = new UserService();
const app = express();

app.use(express.json());

app.post('/users', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email } = req.body;

    // Validate request body
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    const user = await userService.createUser({
      firstName,
      lastName,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json(user);
  } catch (error) {
    const message = (error as Error).message;

    if (message === 'Invalid email address') {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (message === 'Email address already exists') {
      return res.status(400).json({ message: 'Email address already exists' });
    }

    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  try {
    const user = await userService.updateUser(Number(id), {
      firstName,
      lastName,
      email,
      updatedAt: new Date(),
    });
    res.json(user);
  } catch (error) {
    const message = (error as Error).message;

    if (message === 'Invalid email address') {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (message === 'Email address already exists') {
      return res.status(400).json({ message: 'Email address already exists' });
    }

    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await userService.getUserByEmail(email.toString());

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
