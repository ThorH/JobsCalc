const express = require('express')
const routes = express.Router()

const views = __dirname + "/views/"

const profile = {
    name: "Thor",
    avatar: "https://github.com/ThorH.png",
    /* as "" sao colocadas por causa do - no meio das variaveis*/
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75
}

const jobs = [
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

]

function remainingDays (job){

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


routes.get('/', (req, res) => {

    const updatedJobs = jobs.map((job) => {
        // ajustes ap jobs     
        const remaining = remainingDays(job)
        const status = remaining <= 0 ? "done" : "progress"

        return {
            ...job, /* espalha todo o objeto com ... , adiciona o remaining e cria um array novo chamado updatedJobs */
            remaining,
            status,
            budget: profile["value-hour"] * job["total-hours"]
        } 
    })


    return res.render(views + "index", { jobs: updatedJobs })
})
routes.get('/job', (req, res) => res.render(views + "job"))
routes.post('/job', (req, res) => {

    // Verifica se existe job no array, se nao existe, coloca 1 no ID do primeiro job que vai ser criado
    const lastId = jobs[jobs.length - 1]?.id || 1;

    jobs.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now() // atribuindo data de hoje
    })

    return res.redirect('/')
})
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', (req, res) => res.render(views + "profile", { profile }))

module.exports = routes