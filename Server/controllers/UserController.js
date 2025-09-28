import { Webhook } from "svix"
import userModel from "../models/userModel.js";

// API controller function to get all users (for testing)
const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-__v');
        res.json({
            success: true,
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// API controller function to manage clerk user with database
//http://localhost:4000/api/user/webhooks

const clerkWebhook = async (req, res) => {
    console.log('🔔 Webhook received:', new Date().toISOString());
    
    try{
        // Create a svix instance with your clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // req.body is a Buffer because of express.raw
        const payload = req.body instanceof Buffer ? req.body.toString('utf8') : JSON.stringify(req.body);
        await whook.verify(payload,{
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        const {data, type} = JSON.parse(payload);

        switch(type){
            case "user.created":{

                const userData={
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstname: data.first_name,
                    lastname: data.last_name,
                    photo: data.image_url
                }

                console.log('Creating user with data:', userData);
                const newUser = await userModel.create(userData);
                console.log('User created successfully:', newUser._id);
                res.json({success: true, message: 'User created successfully'});

                break;
            }

            case "user.updated":{

                const userData={
                    email: data.email_addresses[0].email_address,
                    firstname: data.first_name,
                    lastname: data.last_name,
                    photo: data.image_url
                }

                console.log('Updating user with clerkId:', data.id);
                const updatedUser = await userModel.findOneAndUpdate({clerkId: data.id}, userData, {new: true});
                console.log('User updated successfully:', updatedUser?._id);
                res.json({success: true, message: 'User updated successfully'});

                break;
            }

            case "user.deleted":{

                console.log('Deleting user with clerkId:', data.id);
                const deletedUser = await userModel.findOneAndDelete({clerkId: data.id});
                console.log('User deleted successfully:', deletedUser?._id);
                res.json({success: true, message: 'User deleted successfully'});

                break;
            }
            default:
                break;
        }

    }catch(error){
        console.error('Webhook error:', error.message);
        console.error('Full error:', error);
        res.status(400).json({success:false, message:error.message});
    }
}

export { clerkWebhook, getUsers };