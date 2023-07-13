import app from "../src/app"
import supertest from "supertest";

const server = supertest(app)

describe("POST /fruit", () => {
  // should return 201 when inserting a fruit
  it("retorno 201", async () => {
    const result = (await server.post("/fruits").send({
      name: 'banana',
      price: 55
    }))
    expect(result.status).toBe(201)
  })
  // should return 409 when inserting a fruit that is already registered
  it("post already registered fruit", async () => {
    const result = (await server.post("/fruits").send({
      name: 'banana',
      price: 55
    }))
    expect(result.status).toBe(409)
  })
  // should return 422 when inserting a fruit with data missing
  it("post fruit with price missing", async () => {
    const result = (await server.post("/fruits").send({
      name: 'banana'
    }))
    expect(result.status).toBe(422)
  })

  it("post fruit with name missing", async () => {
    const result = (await server.post("/fruits").send({
      price: 55
    }))
    expect(result.status).toBe(422)
  })

  it("post fruit with wrong data", async () => {
    const result = (await server.post("/fruits").send({
      nome: "abacaxi"
    }))
    expect(result.status).toBe(422)
  })
});

describe("GET /fruits", () => {
  // shoud return 404 when trying to get a fruit that doesn't exists
  it("/fruits/:id", async () => {
    const result = await server.get("/fruits/50") 
    expect(result.status).toBe(404)
  })
  
  // should return 400 when id param is not valid
  it("/fruits/:id whit wrong id", async () => {
    const result = await server.get("/fruits/batata") 
    expect(result.status).toBe(400)
  })
  // should return a fruit given an id
  it("/fruits/:id with valid id", async () => {
    const result = await server.get("/fruits/1") 
    expect(result.status).toBe(200)
    expect(result.body).toMatchObject({
      name: expect.any(String),
      price: expect.any(Number)
    })
  })
  // should return all fruits
  it("/fruits", async () => {
    const result = await server.get("/fruits") 
    expect(result.status).toBe(200)
    expect(result.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: expect.any(String),
        price: expect.any(Number)
      })
    ]))
  })
})