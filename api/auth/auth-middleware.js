const { useStore } = require("react-redux")

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted() {
  if (require.session.user) {
    next()
  } else {
    next({ status: 401, message: "You shall not pass!"})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  const { username } = req.body
  try{
    const user = await User.findBy({ username })
    if(user.length > 0) {
      next({status: 422, message: "Username taken"})
    } else {
      next()
    } 
  }catch(err){
    next(err)
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  const { username } = req.body
  try{
    const user = await User.findBy({ username })
    if (user.length > 0){
      req.passwordFromDb = user[0].password
      next()
    } else {
      return next({ status: 401, message: 'Invalid credentials'})
    }
  }catch(err){
    next(err)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {

}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = { restricted, checkUsernameExists, checkUsernameFree, checkPasswordLength}
