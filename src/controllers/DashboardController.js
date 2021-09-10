const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
    index(req, res) {

        jobs = Job.get()
        profile = Profile.get()

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        // total de horas por dia de cada Job em progresso
        let jobTotalHours = 0
        
        const updatedJobs = jobs.map((job) => {
            // ajustes ap jobs     
            const remaining = JobUtils.remainingDays(job)
            const status = remaining <= 0 ? "done" : "progress"

            // Somando a quantidade de status
            statusCount[status]++ /* ou statusCount[status] += 1*/

            JobTotalHours = status == 'progress' ? jobTotalHours += Number(job['daily-hours']) : jobTotalHours

            return {
                ...job, /* espalha todo o objeto com ... , adiciona o remaining e cria um array novo chamado updatedJobs */
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            } 
        })

        // quantidade de  horas que quero trabalhar menos a quantidade de horas/dia de cada job em progress
        const freeHours = profile["hours-per-day"] - jobTotalHours;

        return res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours }) /*jobs é o nome que o updatedjobs vai ter no index, se a variavel a ser passada fosse a mesma do index, seria apenas jobs sem o : seguido do outro nome*/
    }
}
