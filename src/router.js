const express = require("express");
const router = express.Router();
const user = require("../src/controller/user");
const { body, validationResult } = require('express-validator');
const ModuleUser = require("./models/user");

router.get("/", user.show);
router.get("/:id", user.each);
router.post(
  "/create",
  [
    body("name").trim().escape()
      .isLength({ min: 3 })
      .withMessage("O nome deve ter no minimo 3 caracteres!."),
    body("email").isEmail().withMessage("Email Inválido.")
    .custom(async (email) => {
        const user = await ModuleUser.findOne({where: { email }});
        if (user)
           throw new Error('Este email já está em uso');
    }),
    body("password").trim().escape()
     .isLength({ min: 6 })
     .withMessage("A password deve ter no mínimo 6 caracters."),
  ],
  user.create
);
router.put("/update/:id", user.update);
router.delete("/delete/:id", user.delete);
router.post("/login", user.login);

module.exports = router;
