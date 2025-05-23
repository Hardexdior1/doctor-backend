
import passport from 'passport'
import {Strategy} from 'passport-local'
import { User } from '../mongoose/schema/user.js'
passport.serializeUser((user,done)=>{
    done(null,user.id)

})
passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await User.findById(id);
        if (!findUser) {
            console.warn("User not found in deserializeUser"); 
            return done(null, false);
        }
        done(null, findUser);
    } catch (error) {
        console.error("Error deserializing user:", error);
        done(null, false); 
    }
});
export default passport.use(
    new Strategy( async(username,password,done)=>{
     try {

        const findUser= await User.findOne({username})
        if(!findUser) throw new Error('user not found')
            if(findUser.password!==password) throw new Error ('Bad credentials')

                done(null,findUser)
     } catch (error) {

        done(error,null)
        
     }
    })
)


