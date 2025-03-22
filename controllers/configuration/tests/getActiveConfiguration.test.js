const mockingoose = require("mockingoose");
const server = require("../../../app");
const request = require("supertest");
const mockConfigurations = require("./mockConfigurations");
const ActiveConfiguration = require("../../../models/configuration/activeConfigurationModel");

ActiveConfiguration.schema.path("configuration", Object);

beforeEach(() => {
  mockingoose.resetAll();
});

const mockConfiguration = {
  ...mockConfigurations.basic.input,
  _id: "56cb91bdc3464f14678934c1",
};

const mockActiveConfiguration = {
  _id: "56cb91bdc3464f14678934ca",
  configuration: mockConfiguration,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("GET /api/v1/configuration", () => {
  it("should return the active configuration", async () => {
    mockingoose(ActiveConfiguration).toReturn(
      mockActiveConfiguration,
      "findOne"
    );
    const res = await request(server).get("/api/v1/configuration");
    expect(res.statusCode).toBe(200);
    expect(res.body.activeConfiguration).toBeDefined();
    expect(res.body.activeConfiguration._id).toBe(mockActiveConfiguration._id);
    expect(res.body.activeConfiguration.configuration).toBeDefined();
    expect(res.body.activeConfiguration.configuration.blocks).toBeDefined();
    expect(res.body.activeConfiguration.configuration.blocks.length).toBe(
      mockConfiguration.blocks.length
    );
    expect(res.body.activeConfiguration.configuration.blocks[0].type).toBe(
      mockConfiguration.blocks[0].type
    );
    expect(res.body.activeConfiguration.configuration.blocks[0].message).toBe(
      mockConfiguration.blocks[0].message
    );
    expect(res.body.activeConfiguration.configuration.blocks[0].nextBlock).toBe(
      mockConfiguration.blocks[0].nextBlock
    );
    expect(res.body.activeConfiguration.configuration._id).toBe(
      mockConfiguration._id
    );
  });
  it("should fail to return the active configuration if not found", async () => {
    mockingoose(ActiveConfiguration).toReturn(null, "findOne");
    const res = await request(server).get("/api/v1/configuration");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("No active configuration found");
  });
});
