const Joi = require("@hapi/joi");
const router = require("express").Router();

// Get Budgets
const getBudgetsParamSchema = Joi.object().keys({
  active: Joi.boolean()
});

router.get("/", async (req, res) => {
  const { error } = getBudgetsParamSchema.validate(req.query);
  if (error) {
    return res.status(400).send(error);
  }

  const { db, query } = req;
  const { active } = query;

  const dbQuery = db("Budgets");

  if (active !== undefined && active !== null) {
    dbQuery.where("active", active === "true");
  }

  const budgets = await dbQuery;

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

  const { db } = req;
  const { budgets } = req.body;

  await db("Budgets").insert(budgets);

  return res.status(200).end();
});

// Create/Replace Budget
const putBudgetBodySchema = Joi.object().keys({
  budget: Joi.object().keys({
    id: Joi.number().integer(),
    accountID: Joi.number().integer().required(),
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    active: Joi.boolean()
  })
});

router.put("/", async (req, res) => {
  const { error } = putBudgetBodySchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const { db } = req;
  const { budget: {
    id,
    accountID,
    name,
    description,
    active
  } } = req.body;

  if (id !== null && id !== undefined) {
    // Replace existing budget if there's an id
    await db("Budgets")
      .where({ id })
      .update({ accountID, name, description, active });
  } else {
    // Create budget if there's no id
    await db("Budgets").insert({
      accountID,
      name,
      description,
      ...(active && { active })
    });
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

  const { db } = req;
  const { id } = req.params;

  await db("Budgets").where({ id }).delete();

  return res.status(200).end();
});

module.exports = router;
