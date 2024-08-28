const {
 GameContract,
 NameContract,
} = require("generated");

const crypto = require('crypto');
 
function stringToHash(string) {
  const hash = crypto.createHash('sha256');
  hash.update(string);
  return hash.digest('hex');
}
function combineHash(data1, data2){
  const hash = crypto.createHash('sha256');
  hash.update(data1 + data2);
  return hash.digest('hex');
}
function tai64ToDate(tai64) {
  const dateStr = (
    (tai64 - BigInt(Math.pow(2, 62)) - BigInt(10)) *
    1000n
  ).toString();
  return new Date(+dateStr).toISOString();
}

function addYears(dateStr, yearsToAdd) {
    const date = new Date(dateStr);
    date.setFullYear(date.getFullYear() + yearsToAdd);
    return date.toISOString();
 }

GameContract.DeListEvent.loader(async ({event, context}) => {
});

GameContract.DeListEvent.handler(async ({event, context}) => {
  const entity = {
    id: `${event.data.id}`,
    owner: `${event.data.owner.payload.bits}`,
    constella: `${event.data.constella}`,
    epoch: `${event.data.epoch}`,
    time: `${tai64ToDate(event.data.time)}`,
  };

  context.Game_ListEvent.deleteUnsafe(event.data.id);
  context.Game_DeListEvent.set(entity);
});

GameContract.ListEvent.loader(async ({event, context}) => {
});

GameContract.ListEvent.handler(async ({event, context}) => {
  const entity = {
    id: `${event.data.id}`,
    owner: `${event.data.owner.payload.bits}`,
    ownergene: `${event.data.ownergene}`,
    bonus: `${event.data.bonus}`,
    constella: `${event.data.constella}`,
    epoch: `${event.data.epoch}`,
    time: `${tai64ToDate(event.data.time)}`,
  };
  context.Game_ListEvent.set(entity);
});

GameContract.BattleEvent.loader(async ({event, context}) => {
});

GameContract.BattleEvent.handler(async ({event, context}) => {
  const entity = {
    id: `${event.data.id}`,
    winer: `${event.data.winer.payload.bits}`,
    loser: `${event.data.loser.payload.bits}`,
    winer_back: `${event.data.winer_back}`,
    winer_win: `${event.data.winer_win}`,
    loser_get: `${event.data.loser_get}`,
    epoch: `${event.data.epoch}`,
    time: `${tai64ToDate(event.data.time)}`,
  };
  context.Game_ListEvent.deleteUnsafe(event.data.id);
  context.Game_BattleEvent.set(entity);
});

GameContract.EnterPoolEvent.loader(async ({event, context}) => {
});

GameContract.EnterPoolEvent.handler(async ({event, context}) => {
  const entity = {
    id: `${combineHash(event.data.owner.payload.bits, event.data.epoch)}`,
    owner: `${event.data.owner.payload.bits}`,
    weight: `${event.data.weight}`,
    epoch: `${event.data.epoch}`,
    time: `${tai64ToDate(event.data.time)}`,
  };
  context.Game_EnterPoolEvent.set(entity);
});

GameContract.UpdateWeightPoolEvent.loader(async ({event, context}) => {
    context.Game_EnterPoolEvent.load(combineHash(event.data.owner.payload.bits, event.data.epoch));
});

GameContract.UpdateWeightPoolEvent.handler(async ({event, context}) => {
  const existingEvent = context.Game_EnterPoolEvent.get(combineHash(event.data.owner.payload.bits, event.data.epoch));
  const entity = {
    id: `${existingEvent.id}`,
    owner: `${existingEvent.owner}`,
    weight: `${event.data.weight}`,
    epoch: `${existingEvent.epoch}`,
    time: `${existingEvent.time}`,
  };
  context.Game_EnterPoolEvent.set(entity);
  //context.Game_UpdateWeightPoolEvent.set(entity);
});

NameContract.NameExtendEvent.loader(async ({event, context}) => {
    context.Name_NameRegisteredEvent.load(stringToHash(event.data.name));
});

NameContract.NameExtendEvent.handler(async ({event, context}) => {
  const entity = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    addtime: `${event.data.addtime}`,
    name: `${event.data.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };
  const existingName = context.Name_NameRegisteredEvent.get(stringToHash(event.data.name));
 //console.log(existingName.expiry);
 //console.log(Number(event.data.addtime));
  const changeentity = {
    id: `${existingName.id}`,
    starttime: `${existingName.starttime}`,
    expiry: `${addYears(existingName.expiry, Number(event.data.addtime))}`,
    name: `${event.data.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };

  context.Name_NameExtendEvent.set(entity);
  context.Name_NameRegisteredEvent.set(changeentity);
});

NameContract.ResolvingEvent.loader(async ({event, context}) => {
});

NameContract.ResolvingEvent.handler(async ({event, context}) => {
  
  const entity = {
    id: `${event.data.identity.payload.bits}`,
    name: `${event.data.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };

  context.Name_ResolvingEvent.set(entity);
});

NameContract.NameTransferEvent.loader(async ({event, context}) => {
    context.Name_NameRegisteredEvent.load(stringToHash(event.data.name));
});

NameContract.NameTransferEvent.handler(async ({event, context}) => {
  const entity = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    name: `${event.data.name}`,
    from: `${event.data.from.payload.bits}`,
    to: `${event.data.to.payload.bits}`,
  };
  
  const existingName = context.Name_NameRegisteredEvent.get(stringToHash(event.data.name));
 
  const changeentity = {
    id: `${existingName.id}`,
    starttime: `${existingName.starttime}`,
    expiry: `${existingName.expiry}`,
    name: `${existingName.name}`,
    identity: `${event.data.to.payload.bits}`,
  };

  context.Name_NameTransferEvent.set(entity);
  context.Name_NameRegisteredEvent.set(changeentity);
});

NameContract.BuyEvent.loader(async ({event, context}) => {
    context.Name_NameRegisteredEvent.load(stringToHash(event.data.name));
});

NameContract.BuyEvent.handler(async ({event, context}) => {
  const entity = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    time: `${tai64ToDate(event.data.time)}`,
    price: `${event.data.price}`,
    name: `${event.data.name}`,
    buyer: `${event.data.buyer.payload.bits}`,
    seller: `${event.data.seller.payload.bits}`,
  };
  
  const existingName = context.Name_NameRegisteredEvent.get(stringToHash(event.data.name));
  
  const changeentity = {
    id: `${existingName.id}`,
    starttime: `${existingName.starttime}`,
    expiry: `${existingName.expiry}`,
    name: `${existingName.name}`,
    identity: `${event.data.buyer.payload.bits}`,
  };

  context.Name_BuyEvent.set(entity);
  context.Name_NameRegisteredEvent.set(changeentity);
  context.Name_ListEvent.deleteUnsafe(existingName.id);
});

NameContract.DelistEvent.loader(async ({event, context}) => {
    context.Name_NameRegisteredEvent.load(stringToHash(event.data.name));
});

NameContract.DelistEvent.handler(async ({event, context}) => {
  const entity = {
    id: `${event.transactionId}_${event.receiptIndex}`,
    name: `${event.data.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };
  
  const existingName = context.Name_NameRegisteredEvent.get(stringToHash(event.data.name));
  const changeentity = {
    id: `${existingName.id}`,
    starttime: `${existingName.starttime}`,
    expiry: `${existingName.expiry}`,
    name: `${existingName.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };

  context.Name_DelistEvent.set(entity);
  context.Name_NameRegisteredEvent.set(changeentity);
  context.Name_ListEvent.deleteUnsafe(existingName.id);
});

NameContract.ListEvent.loader(async ({event, context}) => {
    context.Name_NameRegisteredEvent.load(stringToHash(event.data.name));
});

NameContract.ListEvent.handler(async ({event, context}) => {
  const entity = {
    id: `${stringToHash(event.data.name)}`,
    name: `${event.data.name}`,
    owner: `${event.data.owner.payload.bits}`,
    price: `${event.data.price}`,
  };

  const existingName = context.Name_NameRegisteredEvent.get(stringToHash(event.data.name));
  const changeentity = {
    id: `${existingName.id}`,
    starttime: `${existingName.starttime}`,
    expiry: `${existingName.expiry}`,
    name: `${existingName.name}`,
    identity: `0`,
  };
  
  context.Name_ListEvent.set(entity);
  context.Name_NameRegisteredEvent.set(changeentity);
});

NameContract.NameRegisteredEvent.loader(async ({event, context}) => {
});

NameContract.NameRegisteredEvent.handler(async ({event, context}) => {
  const entity = {
    id: `${stringToHash(event.data.name)}`,
    starttime: `${tai64ToDate(event.data.starttime)}`,
    expiry: `${tai64ToDate(event.data.expiry)}`,
    name: `${event.data.name}`,
    identity: `${event.data.identity.payload.bits}`,
  };

  context.Name_NameRegisteredEvent.set(entity);
});
