const Joi = require("@hapi/joi");
const _ = require("lodash");
const router = require("express").Router();

// Get Transaction Sets with items
router.get("/", async (req, res) => {
  const { db } = req;
  const transactionSetItems = await db
    .from("TransactionSets AS ts")
    .join("TransactionSetItems AS tsi", "ts.id", "tsi.transactionSetID")
    .select(
      "ts.id AS setID",
      "ts.name AS setName",
      "ts.description AS setDescription",
      "tsi.id",
      "tsi.budgetID",
      "tsi.amount",
      "tsi.description"
    );

  const transactionSetsMap = {};
  transactionSetItems.forEach(({
    setID,
    setName,
    setDescription,
    id,
    budgetID,
    amount,
    description
  }) => {
    if (!transactionSetsMap[setID]) {
      transactionSetsMap[setID] = {
        id: setID,
        name: setName,
        description: setDescription,
        items: []
      };
    }

    transactionSetsMap[setID].items.push({
      id,
      budgetID,
      amount,
      description
    });
  });

  const transactionSets = _.values(transactionSetsMap);

  res.json(transactionSets);
});

// Creat/Replace Transaction Set
const putTransactionSetBodySchema = Joi.object().keys({
  transactionSet: Joi.object().keys({
    id: Joi.number().integer(),
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    items: Joi.array().items(Joi.object().required().keys({
      budgetID: Joi.number().integer().required(),
      amount: Joi.number().integer().required(),
      description: Joi.string().allow("")
    }))
  })
});

router.put("/", async (req, res) => {
  const { error } = putTransactionSetBodySchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const { db } = req;
  const { transactionSet: {
    id,
    name,
    description,
    items = []
  } } = req.body;

  if (id !== null && id !== undefined) {
    // Replace existing transaction set if there's an id
    await db.transaction(async (trx) => {
      // Update transaction set
      await trx("TransactionSets")
        .where({ id: id })
        .update({ name, description });

      // Delete existing transaction set items
      await trx("TransactionSetItems")
        .where("transactionSetID", id)
        .delete();

      // Insert new items
      await trx("TransactionSetItems").insert(items.map((item) => ({
        transactionSetID: id,
        ...item
      })));
    });
  } else {
    // Create transaction set if there's no id
    await db.transaction(async (trx) => {
      // Insert transaction set
      const [newID] = await trx("TransactionSets").insert({ name, description });

      console.warn(newID);

      // Insert items
      await trx("TransactionSetItems").insert(items.map((item) => ({
        transactionSetID: newID,
        ...item
      })));
    });
  }

  return res.status(200).end();
});

// Delete Transaction Set
const deleteTransactionSetsParamsSchema = Joi.object().keys({
  id: Joi.number().integer().required()
});

router.delete("/:id", async (req, res) => {
  const { error } = deleteTransactionSetsParamsSchema.validate(req.params);
  if (error) {
    return res.status(400).send(error);
  }

  const { db } = req;
  const { id } = req.params;

  await db("TransactionSets").where({ id }).delete();

  return res.status(200).end();
});

module.exports = router;
