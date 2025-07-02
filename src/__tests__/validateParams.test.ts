import { validateParams } from "../middlewares/validateParams";
import { z } from "zod";

describe("validateParams middleware", () => {
  const mockNext = jest.fn();

  const schema = z.object({
    id: z.string().regex(/^\d+$/, "id deve ser numérico"),
  });

  beforeEach(() => {
    mockNext.mockClear();
  });

  it("deve chamar next() quando os parâmetros forem válidos", () => {
    const req: any = { params: { id: "123" } };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const middleware = validateParams(schema);
    console.log("Testando com params válidos:", req.params);
    middleware(req, res, mockNext);

    console.log("mockNext chamado?", mockNext.mock.calls.length > 0);
    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("deve retornar 400 quando os parâmetros forem inválidos", () => {
    const req: any = { params: { id: "abc" } };
    const jsonMock = jest.fn();
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    };

    const middleware = validateParams(schema);
    console.log("Testando com params inválidos:", req.params);
    middleware(req, res, mockNext);

    console.log("Status chamado com:", res.status.mock.calls);
    console.log("JSON chamado com:", jsonMock.mock.calls);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Parâmetros inválidos",
        errors: expect.any(Array),
      })
    );
    expect(mockNext).not.toHaveBeenCalled();
  });
});
