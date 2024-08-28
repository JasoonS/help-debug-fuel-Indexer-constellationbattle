import assert from "assert";
import { 
  TestHelpers,
  Game_ListEvent
} from "generated";
const { MockDb, Game } = TestHelpers;

describe("Game contract ListEvent event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Game contract ListEvent event
  const event = Game.ListEvent.mock({data: {} /* It mocks event fields with default values, so you only need to provide data */});

  it("Game_ListEvent is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Game.ListEvent.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualGameListEvent = mockDbUpdated.entities.Game_ListEvent.get(
      `${event.transactionId}_${event.receiptIndex}`
    );

    // Creating the expected entity
    const expectedGameListEvent: Game_ListEvent = {
      id: `${event.transactionId}_${event.receiptIndex}`,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualGameListEvent, expectedGameListEvent, "Actual GameListEvent should be the same as the expectedGameListEvent");
  });
});
