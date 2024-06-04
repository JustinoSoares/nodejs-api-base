const ModuleUser = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken');

module.exports = {
  //Encontrar todos os usuários
  show: async (req, res) => {
    const users = await ModuleUser.findAll();
    res.json(users);
  },
  //Encontrar um user de cada vez
  each: async (req, res) => {
    const user = await ModuleUser.findByPk(req.params.id);
    res.json(user);
  },
  // criar users
  create: async (req, res) => {
    // function cryptografia
    async function hashPassword(password) {
      const saltsRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltsRounds);
      return hashedPassword;
    }
    //Receber qualquer erro de validação
    const errors = validationResult(req);

    //Verificar se existe algum erro de validação se houver retornar
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map((err) => ({
          type: err.type,
          msg: err.msg,
          campo: err.path,
          valor: err.value,
        })),
      });
    }
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await hashPassword(password);

      const user = await ModuleUser.create({
        name,
        email,
        password: hashedPassword,
      });
      res.status();
      res
        .status(201)
        .json({ message: "User cadastrado com sucesso", users: user });
    } catch (error) {
      res.status(400).json({ errors: "erro de catch" });
    }
  },

  //update de userários
  update: async (req, res) => {
    const user = await ModuleUser.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Not found user" });
    }
    await user.update(req.body);
    res.json(user);
  },

  //deletar usuários
  delete: async (req, res) => {
    try {
      const user = await ModuleUser.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "not found user" });
      }
      await user.destroy();
      res.json({ message: "user deleted" });
    } catch (error) {
         console.log(error);
    }
  },

  //login
  login : async (req, res) =>{
   const errors = validationResult(req);

   if (!errors.isEmpty()){
      return res.status(400).json({error: errors.array().map(erro =>{
        msg: erro.msg
        type: erro.type
      })});
   }
   try {
    const {email, password} = req.body;
    const user = await ModuleUser.findOne({where: {email}})
    if (!user)
      return res.status(401).json({error: "Credenciais Inválidas"});
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({error: "Credenciais Inválidas"});
    const token = jwt.sign({id: user.id}, 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    {expiresIn: '1h'});
    return res.status(200).json({msg: "Login bem sucedido", token});

   } catch (error) {
      return res.status(401).json({error: "Ocorreu um erro"});
   }
  },
};
