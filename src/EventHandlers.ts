/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Game,
  Game_ListEvent,
  Game_AvailableError,
  Game_BattleEvent,
  Game_TimeError,
  Game_AuthorizationError,
  Game_UpdateWeightPoolEvent,
  Game_DeListEvent,
  Game_AssetError,
  Game_MintError,
  Game_AmountError,
  Game_EnterPoolEvent,
  Name,
  Name_NameTransferEvent,
  Name_ListEvent,
  Name_AuthorizationError,
  Name_DelistEvent,
  Name_AssetError,
  Name_NameRegisteredEvent,
  Name_MarketError,
  Name_RegistrationValidityError,
  Name_NameExtendEvent,
  Name_ResolvingEvent,
  Name_BuyEvent,
} from "generated";

Game.ListEvent.handler(async ({ event, context }) => {
  const entity: Game_ListEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Game_ListEvent.set(entity);
});


Game.AvailableError.handler(async ({ event, context }) => {
  const entity: Game_AvailableError = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Game_AvailableError.set(entity);
});


Game.BattleEvent.handler(async ({ event, context }) => {
  const entity: Game_BattleEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Game_BattleEvent.set(entity);
});


Game.TimeError.handler(async ({ event, context }) => {
  const entity: Game_TimeError = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Game_TimeError.set(entity);
});


Game.AuthorizationError.handler(async ({ event, context }) => {
  const entity: Game_AuthorizationError = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Game_AuthorizationError.set(entity);
});


Game.UpdateWeightPoolEvent.handler(async ({ event, context }) => {
  const entity: Game_UpdateWeightPoolEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Game_UpdateWeightPoolEvent.set(entity);
});


Game.DeListEvent.handler(async ({ event, context }) => {
  const entity: Game_DeListEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Game_DeListEvent.set(entity);
});


Game.AssetError.handler(async ({ event, context }) => {
  const entity: Game_AssetError = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Game_AssetError.set(entity);
});


Game.MintError.handler(async ({ event, context }) => {
  const entity: Game_MintError = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Game_MintError.set(entity);
});


Game.AmountError.handler(async ({ event, context }) => {
  const entity: Game_AmountError = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Game_AmountError.set(entity);
});


Game.EnterPoolEvent.handler(async ({ event, context }) => {
  const entity: Game_EnterPoolEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Game_EnterPoolEvent.set(entity);
});


Name.NameTransferEvent.handler(async ({ event, context }) => {
  const entity: Name_NameTransferEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Name_NameTransferEvent.set(entity);
});


Name.ListEvent.handler(async ({ event, context }) => {
  const entity: Name_ListEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Name_ListEvent.set(entity);
});


Name.AuthorizationError.handler(async ({ event, context }) => {
  const entity: Name_AuthorizationError = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Name_AuthorizationError.set(entity);
});


Name.DelistEvent.handler(async ({ event, context }) => {
  const entity: Name_DelistEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Name_DelistEvent.set(entity);
});


Name.AssetError.handler(async ({ event, context }) => {
  const entity: Name_AssetError = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Name_AssetError.set(entity);
});


Name.NameRegisteredEvent.handler(async ({ event, context }) => {
  const entity: Name_NameRegisteredEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Name_NameRegisteredEvent.set(entity);
});


Name.MarketError.handler(async ({ event, context }) => {
  const entity: Name_MarketError = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Name_MarketError.set(entity);
});


Name.RegistrationValidityError.handler(async ({ event, context }) => {
  const entity: Name_RegistrationValidityError = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Name_RegistrationValidityError.set(entity);
});


Name.NameExtendEvent.handler(async ({ event, context }) => {
  const entity: Name_NameExtendEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Name_NameExtendEvent.set(entity);
});


Name.ResolvingEvent.handler(async ({ event, context }) => {
  const entity: Name_ResolvingEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Name_ResolvingEvent.set(entity);
});


Name.BuyEvent.handler(async ({ event, context }) => {
  const entity: Name_BuyEvent = {
    id: `${event.transactionId}_${event.receiptIndex}`,
  };

  context.Name_BuyEvent.set(entity);
});

