const Profile = require('../model/Profile')

module.exports = {
    index(req, res){
        return res.render("profile", { profile: Profile.get() })
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

        Profile.update(data)

        /* ou dava pra fazer assim:

            const valueHour = data["monthly-budget"] / monthlyTotalHours
            
            Profile.update({
                ...Profile.get(),
                ...req.body,
                "value-hour": valueHour
            })
            
            
            = {
                
            }
        */

        return res.redirect('/profile')
    }
}