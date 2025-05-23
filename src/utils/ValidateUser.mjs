export const ValidateUser={
    username:{
        isLength:{
            options:{
                min:5,
                max:32,
            },
            errormessage:"username must be in between 3-10 characters long"

        },

        notEmpty:{
            errormessage:"username should not be empty"
            
        },
        isString: {
            errormessage:"username should be a string"
            
        }
    }
}