import { prisma } from "../src/database";
import supertest from "supertest";
import app from "../src/app";
import itemFactory from "./factory/itemFactory";

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "items"`;
});

describe("Testa POST /items ", () => {
  it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
    const item = itemFactory();
    const result = await supertest(app).post("/items").send(item);
    const createdItem = await prisma.items.findUnique({
      where: {
        title: item.title,
      },
    });
    expect(result.status).toBe(201);
    expect(createdItem).not.toBeNull();
  });

  it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
    const item = itemFactory();
    await supertest(app).post("/items").send(item);

    const result = await supertest(app).post("/items").send(item);

    expect(result.status).toBe(409);
  });
});

describe("Testa GET /items ", () => {
  it("Deve retornar status 200 e o body no formato de Array", async () => {
    const item = itemFactory();
    await supertest(app).post("/items").send(item);
    const result = await supertest(app).get("/items");
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe("Testa GET /items/:id ", () => {
  it("Deve retornar status 200 e um objeto igual a o item cadastrado", async () => {
    const item = itemFactory();
    await supertest(app).post("/items").send(item);
    const createdItem = await prisma.items.findUnique({
      where: {
        title: item.title,
      },
    });
    const result = await supertest(app).get(`/items/${createdItem.id}`);
    expect(result.status).toBe(200);
    expect(result.body.title).toBe(item.title);
  });
  it(
    "Deve retornar status 404 caso não exista um item com esse id",
    async () => {
      const result = await supertest(app).get("/items/1234687951321321546");
      expect(result.status).toBe(404);
    }
  );
});
