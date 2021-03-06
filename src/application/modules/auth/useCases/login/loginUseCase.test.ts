import resources, {resourceKeys} from "../../../../shared/locals";
import applicationStatus from "../../../../shared/status/applicationStatusCodes";
import { mock } from "jest-mock-extended";
import { IAuthProvider } from "../../ports/IAuthProvider";
import { LoginUseCase } from "./index";
import { UserLoginDto } from "../../dto/UserLoginDto";
import { User } from "../../../../../domain/user/User";
import { TokenDto } from "../../dto/TokenDto";
import AppSettings from "../../../../shared/settings/AppSettings";

const authProviderMock = mock<IAuthProvider>();
const loginUseCase = new LoginUseCase(authProviderMock);

const mockToken = "hui3h2r8793y28rh4ui3hq8r94y3q89ry34hwqiohiY*Y@#*Y$*yut8hr4eigf";
const hashedPasswd = "$2a$10$s8cJXa4NK9cmwyfSQCtw0ehi0vZY3XhpuatAmbK.bGJqyZzdJ38z2";

describe("Positive auth tests", () => {
    beforeAll(() => {
        resources.setDefaultLanguage("pt");
    });

    beforeEach(() => {
        authProviderMock.login.mockReset();
    });

    it("Should return a success if the user was logged in", async () => {
        const userLogin: UserLoginDto = { email: "pedromiotti@hotmail.com", password: ("Pedro" + AppSettings.DefaultUserPasswd) };
        const user: User = new User("Pedro", "Miotti", "pedromiotti@hotmail.com",false, false, hashedPasswd);
        authProviderMock.login.mockResolvedValueOnce(user);
        authProviderMock.getJwt.mockResolvedValueOnce(mockToken);

        const result = await loginUseCase.execute(userLogin);

        const data = result.data as TokenDto;

        expect(result.success).toBeTruthy();
        expect(result.statusCode).toBe(applicationStatus.SUCCESS);
        expect(result.message).toBe(resources.get(resourceKeys.USER_LOGGED_IN_SUCCESSFULLY));
        expect(data.expireIn).toBe(AppSettings.JWTExpirationTime);
    })
})

describe("Negative auth tests", () => {
    beforeAll(() => {
        resources.setDefaultLanguage("pt");
    });

    beforeEach(() => {
        authProviderMock.login.mockReset();
    });

    it("Should return a 400 if the email or password is null", async () => {
        const userLogin: UserLoginDto = { email: null, password: null };

        const result = await loginUseCase.execute(userLogin);

        expect(result.success).toBeFalsy();
        expect(result.statusCode).toBe(applicationStatus.BAD_REQUEST);
        expect(result.error).toBe(resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
            missingParams: `email, password`,
        }));
    })

    it("Should return a 400 if the email or password is invalid", async () => {
        const userLogin: UserLoginDto = { email: "pedromiotti@hotmail.com", password: "1234" };
        authProviderMock.login.mockResolvedValueOnce(null);

        const result = await loginUseCase.execute(userLogin);

        expect(result.success).toBeFalsy();
        expect(result.statusCode).toBe(applicationStatus.BAD_REQUEST);
        expect(result.error).toBe(resources.get(resourceKeys.INVALID_EMAIL_OR_PASSWORD));
    })


})