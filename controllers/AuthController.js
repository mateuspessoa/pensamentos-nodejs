const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {

        const {email, password} = req.body

        //Verificar se o usuário existe
        const user = await User.findOne({where: {email: email}})

        if(!user) {
            req.flash('message', 'Usuário não cadastrado')
            res.render('auth/login')
            return 
        }

        //Verificar se a senha está cadastrada corretamente
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch) {
            req.flash('message', 'Senha Inválida!')
            res.render('auth/login')
            return 
        }

        //Inicializando sessão após o login
        req.session.userid = user.id

        req.flash('message', 'Usuário logado com sucesso!')

        req.session.save(() => {
            res.redirect('/')
        })
    }

    static register(req, res) {
        res.render('auth/register')
    }

    //Função de registrar usuário
    static async registerPost(req, res) {

        const {name, email, password, confirmpassword} = req.body

        //Validação de senha
        if(password != confirmpassword) {
            req.flash('message', 'As senhas precisam ser iguais')
            res.render('auth/register')
            return
        }

        //Checar se o usuário já existe
        const checkIfUserExists = await User.findOne({where: {email: email}})

        if(checkIfUserExists) {
            req.flash('message', 'Email já cadastrado')
            res.render('auth/register')
            return
        }

        //Criando a senha
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)


        //Definindo o usuário para o banco de dados
        const user = {
            name,
            email,
            password: hashedPassword
        }

        //Criando usuário no banco de dados
        try {
            const createdUser = await User.create(user)

            //Inicializar a sessão (Após o cadastro, logar automaticamente o usuário)
            req.session.userid = createdUser.id

            req.flash('message', 'Usuário cadastrado com sucesso!')

            req.session.save(() => {
                res.redirect('/')
            })
        }
        catch(err) {
            console.log(err)
        }
        

    }

    //Função de sair da conta
    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}

