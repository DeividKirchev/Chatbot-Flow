const mockingoose = require("mockingoose");
const server = require("../../../app");
const request = require("supertest");
const mockConfigurations = require("./mockConfigurations");
const ActiveConfiguration = require("../../../models/configuration/activeConfigurationModel");
const ChatBlock = require("../../../models/configuration/chatBlockModel");
const Configuration = require("../../../models/configuration/configurationModel");
const mongoose = require("mongoose");

ActiveConfiguration.schema.path("configuration", Object);
jest.mock("../../../models/validators/refIsValid", () => {
  return jest.fn().mockImplementation((value, res, modelName) => {
    return Promise.resolve(true); // Always return true to pass validation
  });
});
beforeEach(() => {
  mockingoose.resetAll();

  ChatBlock.bulkSave = jest.fn(() => {
    return Promise.resolve([]);
  });
});
const setMockActiveConfiguration = (mockActiveConfiguration) => {
  mockingoose(ChatBlock).toReturn(
    mockActiveConfiguration.insertMany,
    "insertMany"
  );
  const ids = mockActiveConfiguration.insertMany.map(
    (block) => new mongoose.Types.ObjectId(block._id)
  );
  let idIndex = 0;

  jest.spyOn(mongoose.Types, "ObjectId").mockImplementation(() => {
    return ids[idIndex++];
  });

  const configuration = {
    blocks: mockActiveConfiguration.insertMany,
    entryBlock:
      mockActiveConfiguration.insertMany.find(
        (block) => block.originalId === mockActiveConfiguration.input.entryBlock
      )?._id || mockActiveConfiguration.insertMany?.[0]?._id,
  };
  mockingoose(Configuration).toReturn(configuration, "save");
  mockingoose(ActiveConfiguration).toReturn(
    { _id: "56cb91bdc3464f14278934c2", configuration: configuration },
    "findOneAndUpdate"
  );
};

describe("POST /api/v1/configuration", () => {
  it("should set the basic active configuration", async () => {
    setMockActiveConfiguration(mockConfigurations.basic);
    const res = await request(server)
      .post("/api/v1/configuration")
      .send(mockConfigurations.basic.input);
    expect(res.statusCode).toBe(200);
    expect(res.body.activeConfiguration).toBeDefined();
    expect(res.body.activeConfiguration.configuration.blocks.length).toBe(
      mockConfigurations.basic.input.blocks.length
    );
    expect(res.body.activeConfiguration.configuration.blocks).toStrictEqual(
      mockConfigurations.basic.insertMany
    );
    expect(res.body.activeConfiguration.configuration.entryBlock).toBe(
      mockConfigurations.basic.insertMany[0]._id
    );
  });
  it("should set the loop active configuration", async () => {
    setMockActiveConfiguration(mockConfigurations.loopConfiguration);
    const res = await request(server)
      .post("/api/v1/configuration")
      .send(mockConfigurations.loopConfiguration.input);
    expect(res.statusCode).toBe(200);
    expect(res.body.activeConfiguration).toBeDefined();
    expect(res.body.activeConfiguration._id).toBe("56cb91bdc3464f14278934c2");
    expect(res.body.activeConfiguration.configuration.blocks).toStrictEqual(
      mockConfigurations.loopConfiguration.insertMany
    );
    expect(res.body.activeConfiguration.configuration.entryBlock).toBe(
      mockConfigurations.loopConfiguration.insertMany[0]._id
    );
  });
  it("should fail to set the no blocks active configuration", async () => {
    setMockActiveConfiguration(mockConfigurations.noBlocks);
    const res = await request(server)
      .post("/api/v1/configuration")
      .send(mockConfigurations.noBlocks.input);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Cannot set active configuration. Missing blocks."
    );
  });
  it("should set the entryBlock active configuration", async () => {
    setMockActiveConfiguration(mockConfigurations.entryBlock);
    const res = await request(server)
      .post("/api/v1/configuration")
      .send(mockConfigurations.entryBlock.input);
    expect(res.statusCode).toBe(200);
    expect(res.body.activeConfiguration).toBeDefined();
    expect(res.body.activeConfiguration.configuration.blocks).toStrictEqual(
      mockConfigurations.entryBlock.insertMany
    );
    expect(res.body.activeConfiguration.configuration.entryBlock).toBe(
      mockConfigurations.entryBlock.insertMany[0]._id
    );
  });
});
