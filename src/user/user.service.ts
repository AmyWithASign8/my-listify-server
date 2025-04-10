import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { AuthExpire, ExperienceToIncreaseLevel } from './user.constant';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';

import type { IAuthorizeDto, ICreateUserDto } from './user.interface';
import { CustomMap } from 'src/common/customs/custom-map/custom-map';

@Injectable()
export class UserService {
  private sessions = new CustomMap<string, number>();

  constructor(private db: PrismaClientService) {}

  async registration(data: ICreateUserDto): Promise<string | undefined> {
    const candidate = await this.db.user.findUnique({
      where: { username: data.username },
    });

    if (candidate) {
      return;
    }

    const user = await this.createUser(data);

    const sid = this.auth(user.id);

    return sid;
  }

  async authorize(dto: IAuthorizeDto) {
    const user = await this.db.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      return;
    }

    if (user.password !== dto.password) {
      return { username: user.username };
    }

    const sid = this.auth(user.id);

    return sid;
  }

  async checkAuth(sid: string) {
    const userId = this.sessions.get(sid);

    if (!userId) {
      return;
    }

    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        level: true,
        experience: true,
        avatar: true,
      },
    });

    await this.extendAuth(sid);

    return user;
  }

  async extendAuth(sid: string) {
    this.sessions.expire(sid, AuthExpire);
  }

  async increaseUserLevel(experience: number, userId: number) {
    const currentLevelInfo = await this.db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { level: true, experience: true },
    });

    let result = currentLevelInfo;

    const newExperience = currentLevelInfo.experience[0] + experience;

    if (newExperience >= ExperienceToIncreaseLevel) {
      const newLevel =
        currentLevelInfo.level +
        Math.min(newExperience / ExperienceToIncreaseLevel);

      result = { level: newLevel };
    } else {
      await this.db.user.update({
        where: { id: userId },
        data: { experience: [newExperience, ExperienceToIncreaseLevel] },
      });

      result = {
        ...result,
        experience: [newExperience, ExperienceToIncreaseLevel],
      };
    }

    return result;
  }

  private async createUser(data: ICreateUserDto) {
    const user = await this.db.user.create({ data });

    return user;
  }

  private auth(userId: number) {
    const sid = randomUUID();

    this.sessions.set(sid, userId);
    this.sessions.expire(sid, AuthExpire);

    return sid;
  }
}
