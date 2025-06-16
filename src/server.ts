import Express from "express"
import cors from 'cors'
import { route } from "./routes/route"
const App = Express()

//.configs
App.use(Express.urlencoded({ extended: true }))
App.use(Express.json())
App.use(cors({
    origin: "*",
}))

//.Middlewares
App.use((request, response, next) => {
    console.log(`[ Request  ] : ${new Date()} - ${request.method} - ${request.url}`)
    next()
})
// .routes 
App.use(route)

const port = 1224

App.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})