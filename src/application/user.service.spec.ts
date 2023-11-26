import { USER_DATABASE_PROVIDER } from '../infrastucture/database/provider/user.provider';
import { Result } from '../common/result';
import { ITodoEntity } from '../model/todo.model';
import { UserService } from './user.service';
import { ITodolistEntity } from '../model/todolist.model';
import { Test, TestingModule } from '@nestjs/testing';
import { AUTH_JWT_PROVIDER } from '../infrastucture/Auth/provider/auth.provider';
import { GenericErrorCode } from '../common/errors/generic-error';
import { Role } from '../common/enum/role.enum';
import { IUserEntity } from '../model/user.model';
import * as bcrypt from 'bcrypt';
import cjsExport from '@typescript-eslint/eslint-plugin';
describe('UserService', () => {
    let userService: UserService;

    const mockUserRepository = {
        createTodolist: jest.fn(),
        getAllTodolist: jest.fn(),
        getOneTodoListById: jest.fn(),
        deleteTodolist: jest.fn(),
        createTodo: jest.fn(),
        getOneTodo: jest.fn(),
        getAllTodo: jest.fn(),
        deleteTodo: jest.fn(),
        updateTodo: jest.fn(),
        getUser: jest.fn(),
        createUser: jest.fn(),
        signIn: jest.fn(),
        generateToken: jest.fn(),
        updateUserRefreshToken: jest.fn(),
        hashData: jest.fn(),
    };

    const mockAuthService = {
        signIn: jest.fn(),
    };

    const expectedTodolistEntity: ITodolistEntity = {
        listTitle: 'test',
        id: '1',
        todos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const expectedTodoEntity: ITodoEntity = {
        title: 'test',
        id: '1',
        description: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: USER_DATABASE_PROVIDER,
                    useValue: mockUserRepository,
                },
                {
                    provide: AUTH_JWT_PROVIDER,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const mockUserId = 'mockUserId';

    describe('createTodolist', () => {
        it('should create a todolist and return a Result with the created todolist', async () => {
            const mockTodolistBody: Partial<ITodolistEntity> = {
                listTitle: 'test',
            };
            const mockUserId = 'mockUserId';

            mockUserRepository.createTodolist.mockResolvedValueOnce(
                expectedTodolistEntity,
            );

            const result: Result<ITodolistEntity> =
                await userService.createTodolist(mockTodolistBody, mockUserId);

            expect(mockUserRepository.createTodolist).toHaveBeenCalledWith(
                mockTodolistBody,
                mockUserId,
            );
            expect(result.isOk()).toBe(true);
            expect(result.value).toEqual(expectedTodolistEntity);
        });

        it('should handle errors during todolist creation and return an Err result', async () => {
            const mockTodolistBody: Partial<ITodolistEntity> = {};

            mockUserRepository.createTodolist.mockRejectedValueOnce(
                'create todolist failed',
            );

            const result: Result<ITodolistEntity> =
                await userService.createTodolist(mockTodolistBody, mockUserId);

            expect(mockUserRepository.createTodolist).toHaveBeenCalledWith(
                mockTodolistBody,
                mockUserId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toEqual('create todolist failed');
        });
    });

    describe('getAllTodolist', () => {
        it('should return array of todolists', async () => {
            mockUserRepository.getAllTodolist.mockResolvedValueOnce([
                expectedTodolistEntity,
            ]);

            const result: Result<ITodolistEntity[]> =
                await userService.getAllTodolist(mockUserId);
            expect(mockUserRepository.getAllTodolist).toHaveBeenCalledWith(
                mockUserId,
            );

            expect(result.isOk()).toBe(true);
            expect(result.value).toEqual([expectedTodolistEntity]);
        });

        it('should handel errors during get all todolist and return Err as Result', async () => {
            mockUserRepository.getAllTodolist.mockRejectedValueOnce(
                'get todolist failed',
            );

            const result: Result<ITodolistEntity[]> =
                await userService.getAllTodolist(mockUserId);

            expect(mockUserRepository.getAllTodolist).toHaveBeenCalledWith(
                mockUserId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toEqual('get todolist failed');
        });
    });

    describe('get one todolist by id', () => {
        it('should get user id and todolist id and return todolits entity', async () => {
            const mockTodolistId = '2';
            mockUserRepository.getOneTodoListById.mockResolvedValueOnce(
                expectedTodolistEntity,
            );

            const result: Result<ITodolistEntity> =
                await userService.getOneTodoListById(
                    mockUserId,
                    mockTodolistId,
                );

            expect(mockUserRepository.getOneTodoListById).toHaveBeenCalledWith(
                mockUserId,
                mockTodolistId,
            );

            expect(result.isOk()).toBe(true);
            expect(result.value).toEqual(expectedTodolistEntity);
        });

        it('should return Err as result for get todolist by id fail section', async () => {
            const mockTodolistId = '3';

            mockUserRepository.getOneTodoListById.mockRejectedValueOnce(
                'todolist not found',
            );
            const result: Result<ITodolistEntity> =
                await userService.getOneTodoListById(
                    mockUserId,
                    mockTodolistId,
                );

            expect(mockUserRepository.getOneTodoListById).toHaveBeenCalledWith(
                mockUserId,
                mockTodolistId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toEqual('todolist not found');
        });
    });

    describe('delete todolist', () => {
        it('should delete todlist id bt given todolist id', async () => {
            const mockTodolistId = '1';
            mockUserRepository.deleteTodolist.mockResolvedValueOnce(true);
            const result: Result<boolean> = await userService.deleteTodolist(
                mockUserId,
                mockTodolistId,
            );
            expect(mockUserRepository.deleteTodolist).toHaveBeenCalledWith(
                mockUserId,
                mockTodolistId,
            );
            expect(result.isOk()).toBe(true);
            expect(result.value).toBe(true);
        });
        it('should delete todolist id bt given todolist id', async () => {
            const mockTodolistId = '2';
            mockUserRepository.deleteTodolist(mockUserId, mockTodolistId);
            const result = await userService.deleteTodolist(
                mockUserId,
                mockTodolistId,
            );
            expect(mockUserRepository.deleteTodolist).toHaveBeenCalledWith(
                mockUserId,
                mockTodolistId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toBe('delete todolist failed');
        });
    });

    describe('create todo', () => {
        const mockTodolistId = '2';
        const mockTodoBody = {
            title: 'test',
            description: 'test',
        };
        it('sould create new todo and return todoEntity', async () => {
            mockUserRepository.getOneTodoListById.mockResolvedValueOnce(
                expectedTodolistEntity,
            );
            mockUserRepository.createTodo.mockResolvedValueOnce(
                expectedTodoEntity,
            );
            const result: Result<ITodoEntity> = await userService.createTodo(
                mockTodoBody,
                mockTodolistId,
                mockUserId,
            );
            expect(mockUserRepository.getOneTodoListById).toHaveBeenCalledWith(
                mockUserId,
                mockTodolistId,
            );
            expect(mockUserRepository.createTodo).toHaveBeenCalledWith(
                mockTodoBody,
                mockUserId,
                mockTodolistId,
            );
            expect(result.isOk()).toBe(true);
            expect(result.value).toEqual(expectedTodoEntity);
        });

        it('should return error when todolist not exist', async () => {
            mockUserRepository.getOneTodoListById.mockResolvedValueOnce(null);

            const result: Result<ITodoEntity> = await userService.createTodo(
                mockTodoBody,
                mockTodolistId,
                mockUserId,
            );

            expect(mockUserRepository.getOneTodoListById).toHaveBeenCalledWith(
                mockUserId,
                mockTodolistId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toBe('todolist does not exist');
        });

        it('should handel error during create todo', async () => {
            mockUserRepository.getOneTodoListById.mockResolvedValueOnce(
                mockTodolistId,
            );
            mockUserRepository.createTodo.mockResolvedValueOnce(null);
            const result = await userService.createTodo(
                mockTodoBody,
                mockTodolistId,
                mockUserId,
            );
            expect(mockUserRepository.getOneTodoListById).toHaveBeenCalledWith(
                mockUserId,
                mockTodolistId,
            );
            expect(mockUserRepository.createTodo).toHaveBeenCalledWith(
                mockTodoBody,
                mockUserId,
                mockTodolistId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toBe('todo create failed');
        });
    });

    describe('get one todo', () => {
        const mockTodoId = '4';
        it('should return one todo by given todo id', async () => {
            mockUserRepository.getOneTodo.mockResolvedValueOnce(
                expectedTodoEntity,
            );
            const result = await userService.getOneTodo(mockTodoId, mockUserId);
            expect(mockUserRepository.getOneTodo).toHaveBeenCalledWith(
                mockTodoId,
                mockUserId,
            );
            expect(result.isOk()).toBe(true);
            expect(result.value).toEqual(expectedTodoEntity);
        });
        it('should return err when todo not found', async () => {
            mockUserRepository.getOneTodo.mockResolvedValue(null);
            const result = await userService.getOneTodo(mockTodoId, mockUserId);
            expect(mockUserRepository.getOneTodo).toHaveBeenCalledWith(
                mockTodoId,
                mockUserId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toBe('todo not found');
            expect(result.err.code).toBe(GenericErrorCode.NOT_FOUND);
        });
        it('should return eror during get todo', async () => {
            mockUserRepository.getOneTodo.mockRejectedValueOnce(
                'error occurred',
            );
            const result = await userService.getOneTodo(mockTodoId, mockUserId);
            expect(mockUserRepository.getOneTodo).toHaveBeenCalledWith(
                mockTodoId,
                mockUserId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toEqual('error occurred');
        });
    });

    describe('get all todo', () => {
        const mockTodolistId = '2';
        it('should return all todos as a array', async () => {
            const mockUserId = 'mockUserId';
            const mockTodolistId = 'mockTodolistId';

            mockUserRepository.getOneTodoListById.mockResolvedValueOnce(null);
            mockUserRepository.getAllTodo.mockResolvedValueOnce([
                expectedTodoEntity,
            ]);

            const result: Result<ITodoEntity[]> = await userService.getAllTodo(
                mockUserId,
                mockTodolistId,
            );

            expect(mockUserRepository.getOneTodoListById).toHaveBeenCalledWith(
                mockTodolistId,
                mockUserId,
            );
            expect(mockUserRepository.getAllTodo).toHaveBeenCalledWith(
                mockUserId,
                mockTodolistId,
            );
            expect(result.isOk()).toBe(true);
            expect(result.value).toEqual([expectedTodoEntity]);
        });

        it('should handel error when todolist is not exists', async () => {
            mockUserRepository.getOneTodoListById.mockResolvedValueOnce(
                expectedTodolistEntity,
            );
            const result = await userService.getAllTodo(
                mockUserId,
                mockTodolistId,
            );
            expect(mockUserRepository.getOneTodoListById).toHaveBeenCalledWith(
                mockTodolistId,
                mockUserId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toBe('todolist does not exist');
        });
        it('should handel error if todos are not found', async () => {
            mockUserRepository.getAllTodo.mockResolvedValueOnce(null);
            const result = await userService.getAllTodo(
                mockUserId,
                mockTodolistId,
            );
            expect(mockUserRepository.getAllTodo).toHaveBeenCalledWith(
                mockUserId,
                mockTodolistId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toBe('todos not found');
        });
        it('should handel error during get all todos', async () => {
            mockUserRepository.getOneTodoListById.mockResolvedValueOnce(null);
            mockUserRepository.getAllTodo.mockRejectedValueOnce(
                'error occurred',
            );
            const result = await userService.getAllTodo(
                mockUserId,
                mockTodolistId,
            );
            expect(mockUserRepository.getOneTodoListById).toHaveBeenCalledWith(
                mockTodolistId,
                mockUserId,
            );
            expect(mockUserRepository.getAllTodo).toHaveBeenCalledWith(
                mockUserId,
                mockTodolistId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toEqual('error occurred');
        });
    });
    describe('delete todo', () => {
        const mockTodoId = '4';
        it('should delete todo by given id', async () => {
            mockUserRepository.deleteTodo.mockResolvedValueOnce(true);

            const result: Result<boolean> = await userService.deleteTodo(
                mockTodoId,
                mockUserId,
            );

            expect(mockUserRepository.deleteTodo).toHaveBeenCalledWith(
                mockTodoId,
                mockUserId,
            );
            expect(result.isOk()).toBe(true);
            expect(result.value).toBe(true);
        });
        it('should handel error during delete todo', async () => {
            mockUserRepository.deleteTodo.mockRejectedValueOnce(
                'delete todo failed',
            );
            const result = await userService.deleteTodo(mockTodoId, mockUserId);
            expect(mockUserRepository.deleteTodo).toHaveBeenCalledWith(
                mockTodoId,
                mockUserId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toBe('delete todo failed');
        });
    });
    describe('update todo', () => {
        const mockNewBody = {
            title: 'new test',
        };
        const expectedNewTodoEntity: Partial<ITodoEntity> = {
            title: 'new test',
            updatedAt: new Date(),
        };
        const mockTodoId = 'mockId';
        const mockTodolistId = 'mockTodolistId';
        it('should update todo', async () => {
            mockUserRepository.updateTodo.mockResolvedValue(
                expectedNewTodoEntity,
            );
            mockUserRepository.getOneTodoListById.mockResolvedValueOnce(
                expectedTodolistEntity,
            );
            const result = await userService.updateTodo(
                mockTodoId,
                mockTodolistId,
                mockNewBody,
                mockUserId,
            );
            expect(mockUserRepository.updateTodo).toHaveBeenCalledWith(
                mockTodoId,
                mockTodolistId,
                mockNewBody,
                mockUserId,
            );
            expect(result.isOk()).toBe(true);
            expect(result.value).toEqual(expectedNewTodoEntity);
        });
        it('should return error if todolist not found', async () => {
            mockUserRepository.updateTodo.mockResolvedValue(
                expectedNewTodoEntity,
            );
            mockUserRepository.getOneTodoListById.mockResolvedValueOnce(null);

            const result = await userService.updateTodo(
                mockTodoId,
                mockTodolistId,
                mockNewBody,
                mockUserId,
            );

            expect(mockUserRepository.getOneTodoListById).toHaveBeenCalledWith(
                mockTodolistId,
                mockUserId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toBe('todolist does not exist');
        });
        it('should return error during update todo', async () => {
            mockUserRepository.getOneTodoListById.mockResolvedValueOnce(
                expectedTodolistEntity,
            );
            mockUserRepository.updateTodo.mockRejectedValueOnce(
                'update todo failed',
            );

            const result = await userService.updateTodo(
                mockTodoId,
                mockTodolistId,
                mockNewBody,
                mockUserId,
            );

            expect(mockUserRepository.getOneTodoListById).toHaveBeenCalledWith(
                mockTodolistId,
                mockUserId,
            );
            expect(result.isError()).toBe(true);
            expect(result.err.message).toEqual('update todo failed');
        });
        describe('signup', () => {
            const mockSignupRequest = {
                username: 'testUsername',
                password: 'testPassword',
            };
            const expectedNewUser = {
                id: '123456',
                username: mockSignupRequest.username,
                refreshToken: 'testRefreshToken',
                role: Role.USER,
                updatedAt: new Date(),
                createdAt: new Date(),
                todoLists: [],
            };
            const mockTokens = {
                accessToken: 'testAccessToken',
                refreshToken: 'testRefreshToken',
            };

            const mockHashedPassword = 'hashedPassword';

            it('should sign up a new user and return a Result with the user details', async () => {
                mockUserRepository.getUser.mockResolvedValueOnce(null);
                mockUserRepository.hashData.mockResolvedValueOnce(
                    'hashedPassword',
                );
                mockUserRepository.createUser.mockResolvedValue(
                    expectedNewUser,
                );
                mockUserRepository.generateToken.mockResolvedValueOnce(
                    mockTokens,
                );
                mockUserRepository.updateUserRefreshToken.mockResolvedValueOnce(
                    true,
                );

                const result: Result<IUserEntity> = await userService.signUp(
                    'newUser',
                    'password',
                );
                expect(mockUserRepository.getUser).toHaveBeenCalledWith({
                    username: 'newUser',
                });
                expect(mockUserRepository.hashData).toHaveBeenCalledWith(
                    mockSignupRequest.password,
                );
                // expect(result.isOk()).toBe(true);
                // expect(result.value.id).toBe('userId');
            });
        });
    });
});
