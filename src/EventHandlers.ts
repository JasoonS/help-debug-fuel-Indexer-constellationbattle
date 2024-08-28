/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Game,
  Game_ListEvent,
  Game_BattleEvent,
  Game_DeListEvent,
  Game_EnterPoolEvent,
  Game_UpdateWeightPoolEvent,
  Name,
  Name_NameTransferEvent,
  Name_ListEvent,
  Name_DelistEvent,
  Name_NameRegisteredEvent,
  Name_NameExtendEvent,
  Name_ResolvingEvent,
  Name_BuyEvent,
} from "generated";

/*
TODO:
- .bytes.toString() is probably not the function you want to convert bytes to a string with. More to look into here.
*/
const crypto = require('crypto');

function stringToHash(string: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(string);
  return hash.digest('hex');
}

function combineHash(data1: string, data2: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(data1 + data2);
  return hash.digest('hex');
}

// Note: in a future version of Envio we will support the Timestamp postgres type directly.
function tai64ToDate(tai64: bigint): string {
  const dateStr = (
    (tai64 - BigInt(Math.pow(2, 62)) - BigInt(10)) *
    1000n
  ).toString();
  return new Date(+dateStr).toISOString();
}

function addYears(dateStr: string, yearsToAdd: number): string {
  const date = new Date(dateStr);
  date.setFullYear(date.getFullYear() + yearsToAdd);
  return date.toISOString();
}

Game.DeListEvent.loader(async ({ event, context }) => {
});

Game.DeListEvent.handler(async ({ event, context }) => {
  const entity: Game_DeListEvent = {
    id: `${event.data.id}`,
    owner: `${event.data.owner.payload.bits}`,
    constella: BigInt(event.data.constella),
    epoch: BigInt(event.data.epoch),
    time: tai64ToDate(event.data.time),
  };

  context.Game_ListEvent.deleteUnsafe(event.data.id);
  context.Game_DeListEvent.set(entity);
});

Game.ListEvent.loader(async ({ event, context }) => {
});

Game.ListEvent.handler(async ({ event, context }) => {
  const entity: Game_ListEvent = {
    id: `${event.data.id}`,
    owner: `${event.data.owner.payload.bits}`,
    ownergene: BigInt(event.data.ownergene),
    bonus: BigInt(event.data.bonus),
    constella: BigInt(event.data.constella),
    epoch: BigInt(event.data.epoch),
    time: tai64ToDate(event.data.time),
  };
  context.Game_ListEvent.set(entity);
});

Game.BattleEvent.loader(async ({ event, context }) => {
});

Game.BattleEvent.handler(async ({ event, context }) => {
  const entity: Game_BattleEvent = {
    id: `${event.data.id}`,
    winer: `${event.data.winer.payload.bits}`,
    loser: `${event.data.loser.payload.bits}`,
    winer_back: BigInt(event.data.winer_back),
    winer_win: BigInt(event.data.winer_win),
    loser_get: BigInt(event.data.loser_get),
    epoch: BigInt(event.data.epoch),
    time: tai64ToDate(event.data.time),
  };
  context.Game_ListEvent.deleteUnsafe(event.data.id);
  context.Game_BattleEvent.set(entity);
});

Game.EnterPoolEvent.loader(async ({ event, context }) => {
});

Game.EnterPoolEvent.handler(async ({ event, context }) => {
  const entity: Game_EnterPoolEvent = {
    id: combineHash(event.data.owner.payload.bits, event.data.epoch.toString()),
    owner: `${event.data.owner.payload.bits}`,
    weight: BigInt(event.data.weight),
    epoch: BigInt(event.data.epoch),
    time: tai64ToDate(event.data.time),
  };
  context.Game_EnterPoolEvent.set(entity);
});

Game.UpdateWeightPoolEvent.loader(async ({ event, context }) => {
  context.Game_EnterPoolEvent.load(combineHash(event.data.owner.payload.bits, event.data.epoch.toString()));
});

Game.UpdateWeightPoolEvent.handler(async ({ event, context }) => {
  const existingEvent = await context.Game_EnterPoolEvent.get(combineHash(event.data.owner.payload.bits, event.data.epoch.toString()));
  if (!existingEvent) {
    // TODO: should this be a fatal error?
    context.log.error("Game.UpdateWeightPoolEvent: existingEvent not found. Can't update weight pool that doesn't exist");
    return;
  }
  const entity: Game_UpdateWeightPoolEvent = {
    id: existingEvent.id,
    owner: existingEvent.owner,
    weight: BigInt(event.data.weight),
    epoch: existingEvent.epoch,
    time: existingEvent.time,
  };
  context.Game_EnterPoolEvent.set(entity);
});

Name.NameExtendEvent.loader(async ({ event, context }) => {
  context.Name_NameRegisteredEvent.load(stringToHash(event.data.name.bytes.toString()));
});

Name.NameExtendEvent.handler(async ({ event, context }) => {
  const entity: Name_NameExtendEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    addtime: BigInt(event.data.addtime),
    name: event.data.name.bytes.toString(),
    identity: `${event.data.identity.payload.bits}`,
  };
  const existingName = await context.Name_NameRegisteredEvent.get(stringToHash(event.data.name.bytes.toString()));
  if (!existingName) {
    // TODO: should this be a fatal error?
    context.log.error("Name.NameExtendEvent: existingName not found. Can't extend name that doesn't exist")
    return;
  }
  const changeentity: Name_NameRegisteredEvent = {
    id: existingName.id,
    starttime: existingName.starttime,
    expiry: addYears(existingName.expiry, Number(event.data.addtime)),
    name: event.data.name.bytes.toString(),
    identity: `${event.data.identity.payload.bits}`,
  };

  context.Name_NameExtendEvent.set(entity);
  context.Name_NameRegisteredEvent.set(changeentity);
});

Name.ResolvingEvent.loader(async ({ event, context }) => {
});

Name.ResolvingEvent.handler(async ({ event, context }) => {
  const entity: Name_ResolvingEvent = {
    id: `${event.data.identity.payload.bits}`,
    name: event.data.name.bytes.toString(),
    identity: `${event.data.identity.payload.bits}`,
  };

  context.Name_ResolvingEvent.set(entity);
});

Name.NameTransferEvent.loader(async ({ event, context }) => {
  context.Name_NameRegisteredEvent.load(stringToHash(event.data.name.bytes.toString()));
});

Name.NameTransferEvent.handler(async ({ event, context }) => {
  const entity: Name_NameTransferEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    name: event.data.name.bytes.toString(),
    from: `${event.data.from.payload.bits}`,
    to: `${event.data.to.payload.bits}`,
  };

  const existingName = await context.Name_NameRegisteredEvent.get(stringToHash(event.data.name.bytes.toString()));

  if (!existingName) {
    context.log.error("Name.NameTransferEvent: existingName not found. Can't transfer name that doesn't exist");
    return;
  }
  const changeentity: Name_NameRegisteredEvent = {
    id: existingName.id,
    starttime: existingName.starttime,
    expiry: existingName.expiry,
    name: existingName.name,
    identity: `${event.data.to.payload.bits}`,
  };

  context.Name_NameTransferEvent.set(entity);
  context.Name_NameRegisteredEvent.set(changeentity);
});

Name.BuyEvent.loader(async ({ event, context }) => {
  context.Name_NameRegisteredEvent.load(stringToHash(event.data.name.bytes.toString()));
});

Name.BuyEvent.handler(async ({ event, context }) => {
  const entity: Name_BuyEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    time: tai64ToDate(event.data.time),
    price: BigInt(event.data.price),
    name: event.data.name.bytes.toString(),
    buyer: `${event.data.buyer.payload.bits}`,
    seller: `${event.data.seller.payload.bits}`,
  };

  const existingName = await context.Name_NameRegisteredEvent.get(stringToHash(event.data.name.bytes.toString()));
  if (!existingName) {
    context.log.error("Name.BuyEvent: existingName not found. Can't buy name that doesn't exist");
    return;
  }

  const changeentity: Name_NameRegisteredEvent = {
    id: existingName.id,
    starttime: existingName.starttime,
    expiry: existingName.expiry,
    name: existingName.name,
    identity: `${event.data.buyer.payload.bits}`,
  };

  context.Name_BuyEvent.set(entity);
  context.Name_NameRegisteredEvent.set(changeentity);
  context.Name_ListEvent.deleteUnsafe(existingName.id);
});

Name.DelistEvent.loader(async ({ event, context }) => {
  context.Name_NameRegisteredEvent.load(stringToHash(event.data.name.bytes.toString()));
});

Name.DelistEvent.handler(async ({ event, context }) => {
  const entity: Name_DelistEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    name: event.data.name.bytes.toString(),
    identity: `${event.data.identity.payload.bits}`,
  };

  const existingName = await context.Name_NameRegisteredEvent.get(stringToHash(event.data.name.bytes.toString()));
  if (!!existingName) {
    const changeentity: Name_NameRegisteredEvent = {
      id: existingName.id,
      starttime: existingName.starttime,
      expiry: existingName.expiry,
      name: existingName.name,
      identity: `${event.data.identity.payload.bits}`,
    };

    context.Name_NameRegisteredEvent.set(changeentity);
  } else {
    context.log.error("Name.DelistEvent: existingName not found. Can't delist name that doesn't exist");
    return;
  }


  context.Name_DelistEvent.set(entity);
  context.Name_ListEvent.deleteUnsafe(existingName.id);
});

Name.ListEvent.loader(async ({ event, context }) => {
  context.Name_NameRegisteredEvent.load(stringToHash(event.data.name.bytes.toString()));
});

Name.ListEvent.handler(async ({ event, context }) => {
  const entity: Name_ListEvent = {
    id: stringToHash(event.data.name.bytes.toString()),
    name: event.data.name.bytes.toString(),
    owner: `${event.data.owner.payload.bits}`,
    price: BigInt(event.data.price),
  };
  context.Name_ListEvent.set(entity);

  const existingName = await context.Name_NameRegisteredEvent.get(stringToHash(event.data.name.bytes.toString()));
  if (!existingName) {
    context.log.error("Name.ListEvent: existingName not found. Can't list name that doesn't exist");
    return;
  }
  const changeentity: Name_NameRegisteredEvent = {
    id: existingName.id,
    starttime: existingName.starttime,
    expiry: existingName.expiry,
    name: existingName.name,
    identity: '0',
  };

  context.Name_NameRegisteredEvent.set(changeentity);
});

Name.NameRegisteredEvent.loader(async ({ event, context }) => {
});

Name.NameRegisteredEvent.handler(async ({ event, context }) => {
  const entity: Name_NameRegisteredEvent = {
    id: stringToHash(event.data.name.bytes.toString()),
    starttime: tai64ToDate(event.data.starttime),
    expiry: tai64ToDate(event.data.expiry),
    name: event.data.name.bytes.toString(),
    identity: `${event.data.identity.payload.bits}`,
  };

  context.Name_NameRegisteredEvent.set(entity);
});

// For events not in the new schema, add logs
Game.AvailableError.handler(async ({ event, context }) => {
  console.log('Game.AvailableError event received:', event);
});

Game.TimeError.handler(async ({ event, context }) => {
  console.log('Game.TimeError event received:', event);
});

Game.AuthorizationError.handler(async ({ event, context }) => {
  console.log('Game.AuthorizationError event received:', event);
});

Game.AssetError.handler(async ({ event, context }) => {
  console.log('Game.AssetError event received:', event);
});

Game.MintError.handler(async ({ event, context }) => {
  console.log('Game.MintError event received:', event);
});

Game.AmountError.handler(async ({ event, context }) => {
  console.log('Game.AmountError event received:', event);
});

Name.AuthorizationError.handler(async ({ event, context }) => {
  console.log('Name.AuthorizationError event received:', event);
});

Name.AssetError.handler(async ({ event, context }) => {
  console.log('Name.AssetError event received:', event);
});

Name.MarketError.handler(async ({ event, context }) => {
  console.log('Name.MarketError event received:', event);
});

Name.RegistrationValidityError.handler(async ({ event, context }) => {
  console.log('Name.RegistrationValidityError event received:', event);
});
