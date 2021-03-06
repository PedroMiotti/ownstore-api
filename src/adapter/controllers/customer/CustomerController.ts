import BaseController, { NextFunction, Request, Response } from "@/adapter/controllers/base/BaseController";
import { CreateUserDto } from "@/application/modules/administrator/dto/CreateUserDto";
import { deleteCustomerUseCase, registerCustomerUseCase, updateCustomerUseCase } from './container/index'
import { UpdateUserDto } from "@/application/modules/administrator/dto/UpdateUserDto";

export class CustomerController extends BaseController {
    constructor() {
        super();
        this.initializeRoutes();
    }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user: CreateUserDto = {
                firstName: req.body?.firstName,
                lastName: req.body?.lastName,
                email: req.body?.email,
                isStaff: req.body?.isStaff,
                isAdmin: req.body?.isAdmin,
                password: req.body?.password
            };

            this.handleResult(res, await registerCustomerUseCase.execute(user));

        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const id: number = parseInt(req.params?.id);
            this.handleResult(res, await deleteCustomerUseCase.execute(id, req.session));

        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user: UpdateUserDto = {
                id: parseInt(req.params?.id),
                firstName: req.body?.firstName,
                lastName: req.body?.lastName,
                email: req.body?.email,
                isStaff: req.body?.isStaff,
                isAdmin: req.body?.isAdmin,
                phone: req.body?.phone,
                gender: req.body?.gender,
                dateOfBirth: req.body?.dateOfBirth,
            };

            this.handleResult(res, await updateCustomerUseCase.execute(user));

        } catch (error) {
            next(error);
        }
    };

    private initializeRoutes(): void {

        this.router.post('/v1/customer/register', this.register);
        this.router.put('/v1/customer/update/:id', this.update);
        this.router.delete('/v1/customer/delete/:id', this.delete);

    }

}

export default new CustomerController();