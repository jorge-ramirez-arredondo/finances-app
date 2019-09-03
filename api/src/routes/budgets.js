const Joi = require("@hapi/joi");
const router = require("express").Router();

const { db } = require("../db");

// Get Budgets
router.get("/", async (req, res) => {
  const budgets = await db("Budgets");

  res.json(budgets);
});

// Create Budgets
const postBudgetsBodySchema = Joi.object().keys({
  budgets: Joi.array().items(Joi.object().keys({
    accountID: Joi.number().integer().required(),
    name: Joi.string().required(),
    description: Joi.string().allow("")
  }))
});

router.post("/", async (req, res) => {
  const { error } = postBudgetsBodySchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const { budgets } = req.body;

  await db("Budgets").insert(budgets);

  return res.status(200).end();
});

// Creat/Replace Budget
const putBudgetBodySchema = Joi.object().keys({
  budget: Joi.object().keys({
    id: Joi.number().integer(),
    accountID: Joi.number().integer().required(),
    name: Joi.string().required(),
    description: Joi.string().allow("")
  })
});

router.put("/", async (req, res) => {
  const { error } = putBudgetBodySchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const { budget: {
    id,
    accountID,
    name,
    description
  } } = req.body;

  if (id !== null && id !== undefined) {
    // Replace existing budget if there's an id
    await db("Budgets")
      .where({ id: id })
      .update({ accountID, name, description });
  } else {
    // Create budget if there's no id
    await db("Budgets").insert({ accountID, name, description });
  }

  return res.status(200).end();
});

// Delete Budget
const deleteBudgetsParamsSchema = Joi.object().keys({
  id: Joi.number().integer().required()
});

router.delete("/:id", async (req, res) => {
  const { error } = deleteBudgetsParamsSchema.validate(req.params);
  if (error) {
    return res.status(400).send(error);
  }

  const { id } = req.params;

  await db("Budgets").where({ id }).delete();

  return res.status(200).end();
});

module.exports = router;
