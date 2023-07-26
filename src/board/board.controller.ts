import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('board')
@UseGuards(AuthGuard())
export class BoardController {
    private logger = new Logger('BoardController');
    constructor(private boardService: BoardService) {}

    // @Get('/')
    // getAllBoards(): Board[] {
    //     return this.boardService.getAllBoards();
    // }

    @Get()
    getAllBoards(
        @GetUser() user: User
    ): Promise<Board[]> {
        this.logger.verbose(`User "${user.username}" retrieving all boards.`)
        return this.boardService.getAllBoard(user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(@Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User): Promise<Board> {
        this.logger.verbose(`User "${user.username}" creating a new board. Payload: ${JSON.stringify(createBoardDto)}`)
        return this.boardService.createBoard(createBoardDto, user);
    }

    @Get('/:id')
    getBoardById(@Param('id') id: number): Promise<Board> {
        return this.boardService.getBoardById(id);
    }

    // @Get('/:id')
    // getBoardById(@Param('id') id: string): Board {
    //     return this.boardService.getBoardById(id);
    // }
    
    // @Post()
    // @UsePipes(ValidationPipe)
    // createBoard(
    //     @Body() CreateBoardDto: CreateBoardDto): Board {
    //         return this.boardService.createBoard(CreateBoardDto);
    // }

    @Delete('/:id')
    deleteBoard(@Param('id', ParseIntPipe) id,
    @GetUser() user: User): Promise<void> {
        return this.boardService.deleteBoard(id, user);
    }

    // @Delete('/:id')
    // deleteBoard(@Param('id') id: string) {
    //     this.boardService.deleteBoard(id);
    // }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus) {
            return this.boardService.updateBoardStatus(id, status);
    }

    // @Patch('/:id/status')
    // updateBoardStatus(
    //     @Param('id') id: string,
    //     @Body('status', BoardStatusValidationPipe) status: BoardStatus) {
    //         return this.boardService.updateBoardStatus(id, status);
    // }
}