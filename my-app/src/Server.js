const mongoose = require("mongoose")
const express = require("express")
const { connectDB } = require("./connectDB.js")
const { populatePokemons } = require("./populatePokemons.js")
const { getTypes } = require("./getTypes.js")
const { handleErr } = require("./errorHandler.js")
const morgan = require("morgan")
const cors = require("cors")

require("dotenv").config();


const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError,
  PokemonAuthError
} = require("./errors.js")

const { asyncWrapper } = require("./asyncWrapper.js")

const PORT = 8080;

const app = express()
// const port = 5000
var pokeModel = null;
const start = asyncWrapper(async () => {
    await connectDB({ "drop": false });
    const pokeSchema = await getTypes();
    // populatePokemons(pokeSchema);
    pokeModel = mongoose.model('pokemons', pokeSchema);

    app.listen(PORT, async (err) => {
        if (err)
            throw new PokemonDbError(err)
        else
            console.log(`Phew! Server is running on port: ${PORT}`);
        
        const doc = await userModel.findOne({ "username": "admin" })
        if (!doc)
            userModel.create({ username: "admin", password: bcrypt.hashSync("admin", 10), role: "admin", email: "admin@admin.ca" })
        
        const doc1 = await userModel.findOne({ "username": "user" })
        if (!doc1)
            userModel.create({ username: "user", password: bcrypt.hashSync("user", 10), role: "user", email:"user@user.ca"})

    })
})
start()

app.use(cors({
    exposedHeaders: ['Authorization']
}))


app.use(express.json())


//AuthServer Starts Here
const bcrypt = require("bcrypt")
app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const userWithHashedPassword = { ...req.body, password: hashedPassword }

  const user = await userModel.create(userWithHashedPassword)
  res.send(user)
}))

const jwt = require("jsonwebtoken")

let refreshTokens = [];

app.post('/login', asyncWrapper(async (req, res) => {
    const { username, password } = req.body
    const user = await userModel.findOne({ username })
    if (!user)
        throw new PokemonAuthError("User not found")
  
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect)
        throw new PokemonAuthError("Password is incorrect")
  
    const accessToken = jwt.sign({
        user: {
            username: user.username,
            password: user.password,
            role: user.role,
        }
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' })
    const refreshToken = jwt.sign({
        user: {
            username: user.username,
            password: user.password,
            role: user.role,
        }
    },
        process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken)
  
    try {
        const updated = await userModel.findOneAndUpdate({ username: user.username }, { token: accessToken, token_invalid: false }, { new: true })
  
        res.header('Authorization', `Bearer ${accessToken} Refresh ${refreshToken}`)
        res.send({ 'user': updated, 'refreshTokens': refreshTokens })
    } catch (error) {
        throw new PokemonAuthError(error)
    }
  }))


app.get('/logout', asyncWrapper(async (req, res) => {

  const user = await userModel.findOne({ token: req.query.appid })
  if (!user) {
    throw new PokemonAuthError("User not found")
  }
  await userModel.updateOne({ token: user.token }, { token_invalid: true })
  res.send("Logged out")
}))

// attempting Logout

app.post('/logout', asyncWrapper(async (req, res) => {
  const auth = req.header('Authorization');
  console.log("logout auth: " + auth);
  if (auth === undefined || auth === null) {
    throw new PokemonAuthError("Token format invalid. Please log in again.")
  }
  const tokenParsed = auth.split(" ");
  if (tokenParsed.length < 4) {
    throw new PokemonAuthError("Token format invalid. Please log in again.")
  }
  const bearer = tokenParsed[0];
  const accessToken = tokenParsed[1];
  const refreshToken = tokenParsed[3];

  try {
    const user = await userModel.findOne({ token: accessToken })
    const updated = await userModel.findOneAndUpdate({ token: user.token }, { token: "", token_invalid: true }, { new: true })
    refreshTokens = refreshTokens.filter(token => token !== refreshToken)

    res.send({ 'user': updated, 'refreshTokens': refreshTokens })
  } catch (error) {
    throw new PokemonAuthError("User not found")
  }
}))


// const { findOne } = require("./userModel.js")
const userModel = require("./userModel.js")

const authUser = asyncWrapper(async (req, res, next) => {
  // const to ken = req.header('auth-token')
  const token = req.query.appid
  if (!token) {
    throw new PokemonAuthError("No Token: Please provide an appid query parameter.")
  }
  const userWithToken = await userModel.findOne({ token })
  if (!userWithToken || userWithToken.token_invalid) {
    throw new PokemonAuthError("Please Login.")
  }
  try {
    // console.log("token: ", token);
    const verified = jwt.verify(token, process.env.TOKEN_SECRET) // nothing happens if token is valid
    next()
  } catch (err) {
    throw new PokemonAuthError("Invalid user.")
  }
})

const authAdmin = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findOne({ token: req.query.appid })
  if (user.role !== "admin") {
    throw new PokemonAuthError("Access denied")
  }
  next()
})



// app.use(morgan("tiny"))
app.use(morgan(":method"))

app.use(cors())


app.use(authUser) // Boom! All routes below this line are protected
app.get('/api/v1/pokemons', asyncWrapper(async (req, res) => {
//   if (!req.query["count"])
//     req.query["count"] = 10
//   if (!req.query["after"])
//     req.query["after"] = 0
  // try {
  const docs = await pokeModel.find({})
    .sort({ "id": 1 })
    .skip(req.query["after"])
    .limit(req.query["count"])
  res.json(docs)
  // } catch (err) { res.json(handleErr(err)) }
}))

app.get('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  // try {
  const { id } = req.query
  const docs = await pokeModel.find({ "id": id })
  if (docs.length != 0) res.json(docs)
  else res.json({ errMsg: "Pokemon not found" })
  // } catch (err) { res.json(handleErr(err)) }
}))
app.get("*", (req, res) => {
  // res.json({
  //   msg: "Improper route. Check API docs plz."
  // })
  throw new PokemonNoSuchRouteError("");
})

app.use(authAdmin)
app.post('/api/v1/pokemon/', asyncWrapper(async (req, res) => {
  // try {
  console.log(req.body);
  if (!req.body.id) throw new PokemonBadRequestMissingID()
  const poke = await pokeModel.find({ "id": req.body.id })
  if (poke.length != 0) throw new PokemonDuplicateError()
  const pokeDoc = await pokeModel.create(req.body)
  res.json({
    msg: "Added Successfully"
  })
  // } catch (err) { res.json(handleErr(err)) }
}))

app.delete('/api/v1/pokemon', asyncWrapper(async (req, res) => {
  // try {
  const docs = await pokeModel.findOneAndRemove({ id: req.query.id })
  if (docs)
    res.json({
      msg: "Deleted Successfully"
    })
  else
    // res.json({ errMsg: "Pokemon not found" })
    throw new PokemonNotFoundError("");
  // } catch (err) { res.json(handleErr(err)) }
}))

app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true,
    overwrite: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  // console.log(docs);
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    // res.json({ msg: "Not found", })
    throw new PokemonNotFoundError("");
  }
  // } catch (err) { res.json(handleErr(err)) }
}))

app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // try {
  const selection = { id: req.params.id }
  const update = req.body
  const options = {
    new: true,
    runValidators: true
  }
  const doc = await pokeModel.findOneAndUpdate(selection, update, options)
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    // res.json({  msg: "Not found" })
    throw new PokemonNotFoundError("");
  }
  // } catch (err) { res.json(handleErr(err)) }
}))



app.use(handleErr)