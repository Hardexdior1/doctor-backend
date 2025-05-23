import { request, Router } from "express";
import { Book } from "../mongoose/schema/bookingschema.js";


const router=Router()

// create booking under a logged-in user

router.post('/api/create-booking',async(request,response)=>{

if(!request.user) {
    return response.status(401).send({msg:"un authorize"})
}
try { 
    // const newBooking =new Book(body)
    const newBooking = new Book({
        user: request.user._id, 
        totalPeople: request.body.totalPeople,
        houseType: request.body.houseType,
      }); 
    console.log("creating booking",newBooking)
    const savedBooking=await newBooking.save()

    return response.status(201).send({msg:'booking created successfully',bookings:savedBooking})
    
} catch (error) {
    return response.status(400).send(error.message)
}
})


// get a booking by id
router.get('/api/bookings/:id', async (request, response) => {
    if (!request.user) {
      return response.status(401).send({ message: "Not authenticated" });
    }
  
    try {
      const booking = await Book.findById(request.params.id);
  
      if (!booking) {
        return response.status(404).send({ message: "Booking not found" });
      }
  
    //   // Optional: Ensure the booking belongs to the logged-in user
    //   if (booking.user.toString() !== request.user._id.toString()) {
    //     return response.status(403).send({ message: "Unauthorized access" });
    //   }
  
      response.status(200).send({ booking });
    } catch (error) {
      console.error("Error fetching booking:", error);
      response.status(500).send({ message: "Server error" });
    }
  });

//   get bookings under a user
router.get('/api/get-all-userbokings',async(request,response)=>{
console.log(request.user)
if(!request.user){
   return response.status(401).send({message:"not authenticated"})
}
console.log("User Data:", request.user); 

try {
    const userBookings=await Book.find({user:request.user._id})
    response.status(200).send({
        msg: "all user bookings",
        user: request.user,
        bookings: userBookings, 
      });
} catch (error) {
    response.status(500).send(error)
}
})


export default router