//Serve para barrar os usuários em rotas que só pode entrar se estiver logado

module.exports.checkAuth = function(req, res, next) {

    const userId = req.session.userid

    if(!userId) {
        res.redirect('/login')
    }

    next()

}