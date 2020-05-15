import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRO } from './models/user.model';
import { UserDto } from './models/user.dto';
import { ResponseMessage, LoginResponse, UserReponse, JwtPayload } from '../../common/models/responses.model';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleType } from '../../common/enum/roles.enum';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) { }

  @Post('login')
  public async doLogin(@Body() userDto: UserDto): Promise<LoginResponse> {
    return await this.authService.doLogin(userDto);
  }

  @Post('register')
  public async doRegister(@Body() userDto: UserDto): Promise<ResponseMessage> {
    return await this.userService.create(userDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  public async doFindAll(@CurrentUser() user: JwtPayload, @Query('pageIndex') pageIndex: number, @Query('pageSize') pageSize: number): Promise<UserReponse> {
    return await this.userService.findAll(pageIndex, pageSize);
  }

  @Get(':id')
  public async doFindById(@Param('id') id: number): Promise<UserReponse> {
    return await this.userService.findById(id);
  }

  @Post()
  public async doCreate(@Body() userDto: UserDto): Promise<ResponseMessage> {
    return await this.userService.create(userDto);
  }

  @Put(':id')
  public async doUpdate(@Param('id') id: number, @Body() userDto: UserDto): Promise<UserReponse> {
    return await this.userService.update(id, userDto);
  }

  @Delete(':id')
  public async doDelete(@Param('id') id: number): Promise<UserReponse> {
    return await this.userService.delete(id);
  }
}
