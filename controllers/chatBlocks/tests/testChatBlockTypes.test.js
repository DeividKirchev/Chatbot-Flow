const request = require("supertest");
const server = require("../../../app");

describe("GET /api/v1/blocks/types", () => {
  it("should return all chat block types", async () => {
    const res = await request(server).get("/api/v1/blocks/types");
    expect(res.statusCode).toBe(200);
    expect(res.body.types).toBeDefined();
    expect(res.body.types.length).toBeGreaterThan(0);
  });
});
