import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { StakeholderService } from '../stakeholder/stakeholder.service';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const mockUsuarioService = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const mockColaboradorService = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const mockStakeholderService = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsuarioService,
          useValue: mockUsuarioService,
        },
        {
          provide: ColaboradorService,
          useValue: mockColaboradorService,
        },
        {
          provide: StakeholderService,
          useValue: mockStakeholderService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
