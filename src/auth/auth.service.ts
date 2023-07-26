import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async createUser(authCredentialDto: AuthCredentialDto): Promise<void> {
        const { username, password } = authCredentialDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.userRepository.create({
            username,
            password: hashedPassword
        })

        try {
            await this.userRepository.save(user);
        } catch (e) {
            if (e.code === '23505') {
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(authCredentialDto: AuthCredentialDto): Promise<{accessToken: string}> {
        const { username, password } = authCredentialDto;
        const user = await this.userRepository.findOne({ where: {username: username} });

        if (user && (await bcrypt.compare(password, user.password))) {
            // 유저 토큰 생성 ( Secret + Payload )
            const payload = { username };
            const accessToken = await this.jwtService.sign(payload);
            
            return { accessToken };
        } else {
            throw new UnauthorizedException('login failed');
        }
    }
}
