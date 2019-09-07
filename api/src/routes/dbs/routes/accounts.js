const Joi = require("@hapi/joi");
const router = require("express").Router();

// Get Accounts
router.get("/", async (req, res) => {
  const { db } = req;
  const accounts = await db("Accounts");

  res.json(accounts);
});

// Create Accounts
const postAccountsBodySchema = Joi.object().keys({
  accounts: Joi.array().items(Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow("")
  }))
});

router.post("/", async (req, res) => {
  const { error } = postAccountsBodySchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const { db } = req;
  const { accounts } = req.body;

  await db("Accounts").insert(accounts);

  return res.status(200).end();
});

// Creat/Replace Account
const putAccountBodySchema = Joi.object().keys({
  account: Joi.object().keys({
    id: Joi.number().integer(),
    name: Joi.string().required(),
    description: Joi.string().allow("")
  })
});

router.put("/", async (req, res) => {
  const { error } = putAccountBodySchema.validate(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const { db } = req;
  const { account: {
    id,
    name,
    description
  } } = req.body;

  if (id !== null && id !== undefined) {
    // Replace existing account if there's an id
    await db("Accounts")
      .where({ id: id })
      .update({ name, description });
  } else {
    // Create account if there's no id
    await db("Accounts").insert({ name, description });
  }

  return res.status(200).end();
});

// Delete Account
const deleteAccountsParamsSchema = Joi.object().keys({
  id: Joi.number().integer().required()
});

router.delete("/:id", async (req, res) => {
  const { error } = deleteAccountsParamsSchema.validate(req.params);
  if (error) {
    return res.status(400).send(error);
  }

  const { db } = req;
  const { id } = req.params;

  await db("Accounts").where({ id }).delete();

  return res.status(200).end();
});

module.exports = router;
