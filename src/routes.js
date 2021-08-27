const express = require('express')
const routes = express.Router()

const views = __dirname + "/views/"

const Profile = {
    data : {
        name: "Thor",
        avatar: "https://github.com/ThorH.png",
        /* as "" sao colocadas por causa do - no meio das variaveis*/
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75
    },
   
    controllers: {
        index(req, res){
            return res.render(views + "profile", { profile: Profile.data })
        },
        update(req, res){
            // req.body para pegar os dados
             const data = req.body

            // definir quantas semnas tem um ano: 52
             const weeksPerYear = 52
            // remover as semenas de férias do ano, para pegar quantas semanas tem em 1 mes
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12
            // quantas horas por semana estou trabalhando na semana
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"]
            
            // horas trabalhadas no mes
            const monthlyTotalHours = weekTotalHours * weeksPerMonth

            //qual será o valor da minha hora?
            data["value-hour"] = data["monthly-budget"] / monthlyTotalHours

            Profile.data = data

            /* ou dava pra fazer assim:

                const valueHour = data["monthly-budget"] / monthlyTotalHours
                
                Profile.data = {
                    ...Profile.data,
                    ...req.body,
                    "value-hour": valueHour
                }
            */

            return res.redirect('/profile')
        }
    }
}

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzzaria Guloso",
            "daily-hours": 2,
            "total-hours": 40,
            created_at: Date.now(),
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now(),
        }
    
    ],

    controllers: {
        index(req, res){
    
            const updatedJobs = Job.data.map((job) => {
                // ajustes ap jobs     
                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? "done" : "progress"
            
                return {
                    ...job, /* espalha todo o objeto com ... , adiciona o remaining e cria um array novo chamado updatedJobs */
                    remaining,
                    status,
                    budget: Profile.data["value-hour"] * job["total-hours"]
                } 
            })
            
            return res.render(views + "index", { jobs: updatedJobs }) /*jobs é o nome que o updatedjobs vai ter no index, se a variavel a ser passada fosse a mesma do index, seria apenas jobs sem o : seguido do outro nome*/
        },

        create(req, res){
            // Verifica se existe job no array, se nao existe, coloca 1 no ID do primeiro job que vai ser criado
            const lastId = Job.data[Job.data.length - 1]?.id || 1;

            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now() // atribuindo data de hoje
            })

            return res.redirect('/')
        },

        showcreated(req, res){
            return res.render(views + "job")
        } 
    },

    services: {
        remainingDays (job){

            // calculo de tempo restante
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed() /* .toFixed() arredonda numeros quebrados */
        
            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(remainingDays) /* getDate da o dia do mes enquanto getDay pega o dia da semana */
            const dueDateInMs = createdDate.setDate(dueDay)
        
            const timeDiffInMs = dueDateInMs - Date.now()
            // transformar milli em dias
            const dayInMs = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDiffInMs / dayInMs) /* Math.floor outra maneira de arredondar */
            
            return dayDiff
        }
    }
}



routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.showcreated)
routes.post('/job', Job.controllers.create)
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)

module.exports = routes