const  Tought = require('../models/Tought')
const User = require('../models/User')

//Vai servir para filtrar
const { Op } = require('sequelize')

module.exports = class ToughtController {
    static async showToughts(req, res) {

        //Criando a lógica da busca
        let search = ''
        
        if(req.query.search) {
          search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old') {
          order = 'ASC'
        } else {
          order = 'DESC'
        }

        //Pegando todos os pensamento e passando para o front-end
        const toughtsData = await Tought.findAll({
          include: User,

          //Serve para conseguir fazer as buscas
          where: {
            title: {[Op.like]: `%${search}%`},
          },
          order: [['createdAt', order]],
        })
        const toughts = toughtsData.map((result) => result.get({ plain: true }))

        let toughtsQty = toughts.length

        if(toughtsQty === 0) {
          toughtsQty = false
        }

        res.render('toughts/home', {toughts, search, toughtsQty})
    }

    static async dashboard(req, res) {

        const userId = req.session.userid

        const user = await User.findOne({
          where: {
            id: userId,
          },
          include: Tought,
          plain: true,
        })

        //Checar se o usuário existe
        if(!user) {
          res.redirect('/login')
        }

        //Pegar apenas os dados nencessários (pensamentos do usuário logado)
        const toughts = user.Toughts.map((result) => result.dataValues)

        //Para saber se existem pensamentos ou não
        let emptyToughts = false
        if(toughts.length === 0) {
          emptyToughts = true
        }

        res.render('toughts/dashboard', { toughts, emptyToughts })
    }

    static createTought(req, res) {
        res.render('toughts/create')
      }
    
      //Função para criar e salvar pensamento
      static createToughtSave(req, res) {
        const tought = {
          title: req.body.title,
          UserId: req.session.userid,
        }
    
        Tought.create(tought).then(() => {

            req.flash('message', 'Pensamento criado com sucesso!')

            req.session.save(() => {
              res.redirect('/toughts/dashboard')
            })
          })
          .catch((err) => console.log(err))
      }

      //Função para remover pensamento
      static async removeTought(req, res) {

        const id = req.body.id
        const UserId = req.session.userid

        try {
          await Tought.destroy({where: {id: id, UserId: UserId}})

          req.flash('message', 'Pensamento removido com sucesso!')

          req.session.save(() => {
            res.redirect('/toughts/dashboard')
          })
        }
        catch(error) {
          console.log(error)
        }

      }

      //Função para preencher o formulário para ser editado
      static updateTought(req, res) {
        const id = req.params.id
    
        Tought.findOne({ where: { id: id }, raw: true })
          .then((tought) => {
            res.render('toughts/edit', { tought })
          })
          .catch((err) => console.log())
      }
    
      //Função para atualizar o pensamento no banco de dados
      static updateToughtPost(req, res) {
        const id = req.body.id
    
        const tought = {
          title: req.body.title,
          description: req.body.description,
        }
    
        Tought.update(tought, { where: { id: id } })
          .then(() => {
            req.flash('message', 'Pensamento atualizado com sucesso!')
            req.session.save(() => {
              res.redirect('/toughts/dashboard')
            })
          })
          .catch((err) => console.log())
      }
}