module.exports =  {
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
    },

    calculateBudget: (job, valueHour) => valueHour * job["total-hours"]

}