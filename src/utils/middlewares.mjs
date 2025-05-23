
// import mockUsers from "./Contents.mjs"
export const resolveIndexByUserId=(request,response,next)=>{
    const {params:{id}}=request

    const parsedId=parseInt(id)

        if(isNaN(parsedId)) return response.sendStatus(400).send({msg:"bad request bro"})
            const findIndex=mockUsers.findIndex((user)=>user.id===parsedId)
            if(findIndex===-1) return response.sendStatus(404)
                request.findIndex=findIndex
            next()
}