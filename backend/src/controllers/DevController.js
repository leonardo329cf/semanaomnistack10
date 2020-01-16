const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')


module.exports = {
    async index(request, response) {
        const devs = await Dev.find()
        return response.json(devs)
    },
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body

        let dev = await Dev.findOne({ github_username })

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

            const { name = login, avatar_url, bio } = apiResponse.data

            const techsArray = parseStringAsArray(techs)

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })
        }
        return response.json(dev)
    },
    async update(request, response) {
        const { github_username } = request.params

        const { techs, latitude, longitude } = request.body

        let dev = await Dev.findOne({ github_username })

        if (dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

            const { name = login, avatar_url, bio } = apiResponse.data

            const techsArray = parseStringAsArray(techs)

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.findOneAndUpdate({
                    github_username
                }, 
                {
                    avatar_url,
                    bio,
                    techs: techsArray,
                    location,
                },
                {
                    new:true  
                })
            return response.json(dev)
        }
        else {
            return response.json('Dev dont exist in the database')
        }
        
    },

    async delete(request, response) {
        const { github_username } = request.params
        
        let dev = await Dev.findOne({ github_username })

        if (dev) {
            dev = await Dev.findOneAndRemove({
                    github_username
                })
            return response.json('Dev deleted')
        }
        else {
            return response.json('Dev dont exist in the database')
        }
    }
}